import Web3 from 'web3';
import axios from 'axios';
import dotenv from 'dotenv';
import { Transaction, Wallet, Token } from '../models/index.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';

dotenv.config();

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`);

// Validate Ethereum address
const isValidAddress = (address) => {
    return Web3.utils.isAddress(address);
};

// Get ETH balance
export const getBalance = catchAsync(async (req, res, next) => {
    const { address } = req.params;
    
    if (!isValidAddress(address)) {
        return next(new AppError('Invalid Ethereum address format', 400));
    }

    const balance = await web3.eth.getBalance(address);
    res.json({ balance: web3.utils.fromWei(balance, 'ether') });
});

// Get transaction history
export const getTransactionsDetails = catchAsync(async (req, res, next) => {
    const { address } = req.params;

    if (!isValidAddress(address)) {
        return next(new AppError('Invalid Ethereum address format', 400));
    }

    const response = await axios.get(`https://api.etherscan.io/api`, {
        params: {
            module: 'account',
            action: 'txlist',
            address: address,
            startblock: 0,
            endblock: 99999999,
            sort: 'desc',
            apikey: process.env.ETHERSCAN_API_KEY
        }
    });

    if (response.data.status !== '1' || !Array.isArray(response.data.result)) {
        throw new AppError(response.data.message || 'Failed to fetch transactions', 500);
    }

    const transactions = response.data.result.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: web3.utils.fromWei(tx.value, 'ether'),
        status: tx.isError === '0'
    }));

    res.json({ transactions });
});

// Get token details
export const getTokenDetails = async (req, res) => {
    try {
        const { address } = req.params;
        if (!isValidAddress(address)) {
            return res.status(400).json({ 
                error: 'Invalid Ethereum address format' 
            });
        }
        const response = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'tokenlist',
                address: address,
                apikey: process.env.ETHERSCAN_API_KEY
            }
        });
        if (response.data.status !== '1') {
            throw new Error(response.data.message || 'Failed to fetch tokens');
        }
        const tokens = Array.isArray(response.data.result) 
            ? response.data.result.map(token => ({
                address: token.contractAddress,
                name: token.name,
                symbol: token.symbol,
                balance: web3.utils.fromWei(token.value || '0', 'ether'),
                decimals: token.decimals,
                usdValue: '0.00'
            }))
            : [];
        res.json({ tokens });
    } catch (error) {
        console.error('Token fetch error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add to your existing controller code:

export const saveTransaction = async (req, res) => {
  try {
    const txData = req.body;
    const transaction = new Transaction({
      hash: txData.hash,
      type: 'ETH',
      from: txData.from,
      to: txData.to,
      value: txData.value,
      gasUsed: txData.gasUsed,
      gasPrice: txData.gasPrice,
      status: txData.status || 'pending',
      blockNumber: txData.blockNumber,
      network: txData.network
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWalletTransactions = async (req, res) => {
  try {
    const { address } = req.params;
    const transactions = await Transaction.find({
      $or: [{ from: address }, { to: address }]
    }).sort({ timestamp: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { hash } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { hash },
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
