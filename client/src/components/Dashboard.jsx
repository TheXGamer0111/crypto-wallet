import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useAuth } from '../context/AuthContext';

import { useWebSocket } from '../context/WebSocketContext';

import { useToast } from './common/Toast';

import WalletDashboard from './WalletDashboard';

import TokenList from './TokenList';

import TransactionHistory from './TransactionHistory';

import SendTransaction from './SendTransaction';

import Loading from './common/Loading';

import Navbar from './Navbar';



function Dashboard({ account, connectWallet, provider }) {

  const navigate = useNavigate();

  const { user } = useAuth();

  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);



  const handleConnectWallet = async () => {

    setLoading(true);

    try {

      const result = await connectWallet();

      if (result?.success) {

        navigate('/wallet');

      }

    } catch (error) {

      addToast(error.message || 'Failed to connect wallet', 'error');

    } finally {

      setLoading(false);

    }

  };



  return (

    <main className="container mx-auto px-4 py-8">

      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">

        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 max-w-2xl">

          <h1 className="text-4xl font-bold mb-4 text-white">Welcome, {user?.email}</h1>

          <p className="text-gray-400 mb-8">

            Connect your wallet to manage your crypto assets and view your portfolio.

          </p>

          <button

            onClick={handleConnectWallet}

            disabled={loading}

            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50"

          >

            {loading ? (

              <div className="flex items-center space-x-2">

                <Loading size="small" />

                <span>Connecting...</span>

              </div>

            ) : (

              'Connect Wallet'

            )}

          </button>

        </div>

      </div>

    </main>

  );

}



export default Dashboard;






