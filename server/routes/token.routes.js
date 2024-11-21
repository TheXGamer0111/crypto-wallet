import express from 'express';
import { 
    addToken, 
    getWalletTokens, 
    removeToken 
} from '../controllers/tokenController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Protect all token routes

router.post('/', addToken);
router.get('/wallet/:walletAddress', getWalletTokens);
router.delete('/:tokenId', removeToken);

export default router;