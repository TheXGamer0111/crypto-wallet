import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { ethers } from 'ethers';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthForm from './components/Auth/AuthForm';
import Dashboard from './components/Dashboard';
import WalletDashboard from './components/WalletDashboard';
import Navbar from './components/Navbar';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);
        setProvider(provider);
        return { success: true, address };
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      return { success: false, error };
    }
  };

  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <WebSocketProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
              <Navbar account={account} connectWallet={connectWallet} />
              <Routes>
                <Route path="/login" element={<AuthForm />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard 
                        account={account} 
                        connectWallet={connectWallet}
                        provider={provider}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wallet"
                  element={
                    <ProtectedRoute>
                      <WalletDashboard 
                        account={account} 
                        provider={provider}
                      />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </WebSocketProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;