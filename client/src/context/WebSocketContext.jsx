import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useAuth } from './AuthContext';



const WebSocketContext = createContext(null);



export const WebSocketProvider = ({ children }) => {

  const ws = useRef(null);

  const { user } = useAuth();

  const [isConnected, setIsConnected] = useState(false);

  const reconnectTimeout = useRef(null);

  const reconnectAttempts = useRef(0);

  const maxReconnectAttempts = 3;



  const connect = () => {

    try {

      if (ws.current?.readyState === WebSocket.OPEN) {

        return; // Already connected

      }



      ws.current = new WebSocket('ws://localhost:3000');



      ws.current.onopen = () => {

        console.log('WebSocket Connected');

        setIsConnected(true);

        reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection

      };



      ws.current.onclose = () => {

        console.log('WebSocket Disconnected');

        setIsConnected(false);



        // Only attempt to reconnect if we haven't exceeded max attempts

        if (reconnectAttempts.current < maxReconnectAttempts) {

          reconnectAttempts.current += 1;

          reconnectTimeout.current = setTimeout(connect, 5000);

        }

      };



      ws.current.onerror = (error) => {

        console.error('WebSocket error:', error);

      };



      ws.current.onmessage = (event) => {

        try {

          const data = JSON.parse(event.data);

          console.log('Received message:', data);

          

          switch (data.type) {

            case 'PRICE_UPDATE':

              // Handle price updates

              break;

            case 'BALANCE_UPDATE':

              // Handle balance updates

              break;

            case 'NEW_TRANSACTION':

              // Handle new transactions

              break;

            default:

              console.log('Unknown message type:', data.type);

          }

        } catch (error) {

          console.error('Error processing message:', error);

        }

      };

    } catch (error) {

      console.error('WebSocket connection error:', error);

    }

  };



  useEffect(() => {

    if (user) {

      connect();

    }



    return () => {

      if (ws.current) {

        ws.current.close();

      }

      if (reconnectTimeout.current) {

        clearTimeout(reconnectTimeout.current);

      }

      reconnectAttempts.current = 0;

    };

  }, [user]);



  // Add event listener for page visibility

  useEffect(() => {

    const handleVisibilityChange = () => {

      if (document.visibilityState === 'visible' && user) {

        // Reconnect if page becomes visible and we're not connected

        if (!isConnected) {

          reconnectAttempts.current = 0; // Reset reconnect attempts

          connect();

        }

      }

    };



    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {

      document.removeEventListener('visibilitychange', handleVisibilityChange);

    };

  }, [user, isConnected]);



  const subscribe = (address) => {

    if (ws.current?.readyState === WebSocket.OPEN) {

      ws.current.send(JSON.stringify({

        type: 'SUBSCRIBE',

        address

      }));

    }

  };



  return (

    <WebSocketContext.Provider value={{ subscribe, isConnected }}>

      {children}

    </WebSocketContext.Provider>

  );

};



export const useWebSocket = () => useContext(WebSocketContext); 






