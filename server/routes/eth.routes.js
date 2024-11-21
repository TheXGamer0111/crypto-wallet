import express from 'express';
import { 
    getTransactionsDetails, 
    getTokenDetails, 
    getBalance,
    saveTransaction,
    getWalletTransactions,
    updateTransactionStatus 
} from '../controllers/ethController.js';
import { protect } from '../middleware/auth.js';
import { transactionValidationRules, validateRequest } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.get('/test', (req, res) => {
  res.json({ message: 'ETH routes are working!' });
});

// Protected routes
router.use(protect);

router.get('/balance/:address', getBalance);
router.get('/transactions/:address', getTransactionsDetails);
router.get('/tokens/:address', getTokenDetails);
router.post('/transaction', transactionValidationRules, validateRequest, saveTransaction);
router.get('/wallet/:address/transactions', getWalletTransactions);
router.put('/transaction/:hash/status', updateTransactionStatus);

export default router; 