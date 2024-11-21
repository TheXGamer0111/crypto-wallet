import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  wallets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  preferences: {
    defaultCurrency: {
      type: String,
      default: 'USD'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Add a method to get user's total balance
userSchema.methods.getTotalBalance = async function() {
  const wallets = await this.populate('wallets');
  return wallets.wallets.reduce((total, wallet) => total + Number(wallet.balance), 0);
};

export default mongoose.model('User', userSchema);