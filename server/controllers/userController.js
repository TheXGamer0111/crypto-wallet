import { User, Wallet } from '../models/index.js';

export const createUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      email,
      preferences: req.body.preferences
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserWallets = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('wallets');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ wallets: user.wallets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { preferences, lastLogin: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 