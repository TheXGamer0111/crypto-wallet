import { WebSocketServer } from 'ws';

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map();
    
    this.wss.on('connection', (ws) => {
      ws.on('message', (message) => this.handleMessage(ws, message));
      ws.on('close', () => this.handleClose(ws));
    });
  }

  handleMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      if (data.type === 'subscribe' && data.address) {
        this.clients.set(ws, data.address);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  }

  handleClose(ws) {
    this.clients.delete(ws);
  }

  broadcastToAddress(address, data) {
    this.wss.clients.forEach((client) => {
      if (this.clients.get(client) === address) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

let wsService;

export const initializeWebSocket = (server) => {
  wsService = new WebSocketService(server);
  return wsService;
};

export const getWebSocketService = () => wsService; 