import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { validateEnv } from './config/validateEnv.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initializeWebSocket } from './services/websocketService.js';
import { WebSocketServer } from 'ws';

// Import routes
import ethRoutes from './routes/eth.routes.js';
import btcRoutes from './routes/btc.routes.js';
import userRoutes from './routes/user.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import tokenRoutes from './routes/token.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();
validateEnv();

const app = express();
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Handle different message types
      if (data.type === 'SUBSCRIBE') {
        ws.subscribedAddress = data.address;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast to specific address
const broadcastToAddress = (address, data) => {
  wss.clients.forEach((client) => {
    if (client.subscribedAddress === address) {
      client.send(JSON.stringify(data));
    }
  });
};

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/users', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/eth', ethRoutes);
app.use('/api/btc', btcRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/tokens', tokenRoutes);

// Error handling middleware should be last
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

export default app; 


