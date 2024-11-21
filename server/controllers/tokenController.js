import { Token } from '../models/index.js';
import Web3 from 'web3';
import axios from 'axios';

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`);

export const addToken = async (req, res) => {
  try {
    const { address, name, symbol, decimals, walletAddress } = req.body;

    const token = new Token({
      address,
      name,
      symbol,
      decimals,
      walletAddress
    });

    await token.save();
    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWalletTokens = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const tokens = await Token.find({ walletAddress });

    // Update token balances
    const updatedTokens = await Promise.all(tokens.map(async (token) => {
      try {
        const minABI = [
          {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function",
          },
        ];

        const contract = new web3.eth.Contract(minABI, token.address);
        const balance = await contract.methods.balanceOf(walletAddress).call();
        const formattedBalance = balance / (10 ** token.decimals);

        await Token.findByIdAndUpdate(
          token._id,
          { balance: formattedBalance.toString(), lastUpdated: Date.now() }
        );

        return { ...token.toObject(), balance: formattedBalance.toString() };
      } catch (error) {
        console.error(`Error updating token ${token.symbol}:`, error);
        return token;
      }
    }));

    res.json({ tokens: updatedTokens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeToken = async (req, res) => {
  try {
    const { tokenId } = req.params;
    await Token.findByIdAndDelete(tokenId);
    res.json({ message: 'Token removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 