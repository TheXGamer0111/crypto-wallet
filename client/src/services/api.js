import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email) => {
    const response = await api.post('/auth/login', { email });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (email) => {
    const response = await api.post('/auth/register', { email });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const walletService = {
  createWallet: async (type, address) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.post('/wallets', {
      type,
      address,
      userId: user._id
    });
  },

  getWalletBalance: async (address) => {
    return api.get(`/wallets/${address}/balance`);
  },

  getUserWallets: async (userId) => {
    return api.get(`/wallets/user/${userId}`);
  },

  deleteWallet: async (address) => {
    return api.delete(`/wallets/${address}`);
  }
};

export const tokenService = {
  getWalletTokens: async (address) => {
    return api.get(`/tokens/wallet/${address}`);
  },

  addToken: async (tokenData) => {
    return api.post('/tokens', tokenData);
  },

  removeToken: async (tokenId) => {
    return api.delete(`/tokens/${tokenId}`);
  }
};

export const transactionService = {
  getTransactions: async (address) => {
    return api.get(`/eth/transactions/${address}`);
  },

  saveTransaction: async (txData) => {
    return api.post('/eth/transaction', txData);
  },

  updateStatus: async (hash, status) => {
    return api.put(`/eth/transaction/${hash}/status`, { status });
  }
};

export default api; 