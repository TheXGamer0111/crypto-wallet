import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    index: true
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  decimals: {
    type: Number,
    required: true
  },
  balance: {
    type: String,
    default: '0'
  },
  usdValue: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique tokens per wallet
tokenSchema.index({ address: 1, wallet: 1 }, { unique: true });

// Update lastUpdated timestamp before saving
tokenSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.model('Token', tokenSchema); 