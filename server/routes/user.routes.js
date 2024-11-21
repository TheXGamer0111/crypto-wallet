import express from 'express';
import { createUser, getUserWallets, updateUserPreferences } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createUser);
// Protected routes
router.use(protect); // All routes after this will require authentication
router.get('/:userId/wallets', getUserWallets);
router.put('/:userId/preferences', updateUserPreferences);

export default router;