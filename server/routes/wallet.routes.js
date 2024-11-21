import express from 'express';
import { 
    createWallet, 
    getWalletBalance, 
    getUserWallets, 
    deleteWallet 
} from '../controllers/walletController.js';
import { protect } from '../middleware/auth.js';
import { walletValidationRules, validateRequest } from '../middleware/validator.js';

const router = express.Router();

router.use(protect); // Protect all wallet routes

router.post('/', walletValidationRules, validateRequest, createWallet);
router.get('/:address/balance', getWalletBalance);
router.get('/user/:userId', getUserWallets);
router.delete('/:address', deleteWallet);

export default router;
