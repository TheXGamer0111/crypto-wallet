import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['ETH', 'BTC'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token'
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  balance: {
    type: String,
    default: '0'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update the lastUpdated timestamp before saving
walletSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Add a method to get wallet's total value including tokens
walletSchema.methods.getTotalValue = async function() {
  const tokens = await this.populate('tokens');
  const tokenValue = tokens.tokens.reduce((total, token) => total + Number(token.balance), 0);
  return Number(this.balance) + tokenValue;
};

export default mongoose.model('Wallet', walletSchema);