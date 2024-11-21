import { Wallet, User } from '../models/index.js';
import Web3 from 'web3';

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`);

export const createWallet = async (req, res) => {
  try {
    const { address, type, userId } = req.body;

    // Validate Ethereum address if wallet type is ETH
    if (type === 'ETH' && !web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const wallet = new Wallet({
      address,
      type,
      userId
    });

    await wallet.save();

    // Add wallet to user's wallets array
    await User.findByIdAndUpdate(
      userId,
      { $push: { wallets: wallet._id } }
    );

    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWalletBalance = async (req, res) => {
  try {
    const { address } = req.params;
    const wallet = await Wallet.findOne({ address });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    let balance;
    if (wallet.type === 'ETH') {
      balance = await web3.eth.getBalance(address);
      balance = web3.utils.fromWei(balance, 'ether');
    }

    await Wallet.findByIdAndUpdate(
      wallet._id,
      { balance, lastUpdated: Date.now() }
    );

    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserWallets = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallets = await Wallet.find({ userId });
    res.json({ wallets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWallet = async (req, res) => {
  try {
    const { address } = req.params;
    const wallet = await Wallet.findOne({ address });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Remove wallet from user's wallets array
    await User.findByIdAndUpdate(
      wallet.userId,
      { $pull: { wallets: wallet._id } }
    );

    await Wallet.findByIdAndDelete(wallet._id);
    res.json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 