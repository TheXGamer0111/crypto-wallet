import express from 'express';
import * as bitcoin from 'bitcoinjs-lib';   
import axios from 'axios';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Get BTC balance
router.get('/balance/:address', async (req, res) => {
  try {
    const response = await axios.get(`https://blockchain.info/balance?active=${req.params.address}`);
    const data = response.data;
    const balance = data[req.params.address].final_balance / 100000000; // Convert satoshis to BTC
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create BTC wallet
router.post('/create-wallet', (req, res) => {
  try {
    const network = bitcoin.networks.bitcoin;
    const keyPair = bitcoin.ECPair.makeRandom({ network });
    const { address } = bitcoin.payments.p2pkh({ 
      pubkey: keyPair.publicKey,
      network 
    });

    res.json({
      address,
      privateKey: keyPair.toWIF(),
      publicKey: keyPair.publicKey.toString('hex')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 