import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../components/common/Toast';
import Loading from './common/Loading';
import TokenList from './TokenList';
import TransactionHistory from './TransactionHistory';
import SendTransaction from './SendTransaction';

function WalletDashboard({ account, provider }) {
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const networks = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet'
  };

  const fetchWalletInfo = async () => {
    if (!provider || !account) return;

    try {
      const [balance, network, gasPrice] = await Promise.all([
        provider.getBalance(account),
        provider.getNetwork(),
        provider.getGasPrice()
      ]);

      setBalance(ethers.utils.formatEther(balance));
      setNetwork(networks[network.chainId] || `Chain ID: ${network.chainId}`);
      setGasPrice(ethers.utils.formatUnits(gasPrice, 'gwei'));
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      addToast('Failed to fetch wallet information', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletInfo();
    const interval = setInterval(fetchWalletInfo, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [provider, account]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wallet Overview */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Wallet Overview</h2>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-gray-400">Address</p>
                <p className="text-white font-mono">{account}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-gray-400">Balance</p>
                <p className="text-white text-2xl font-bold">{balance} ETH</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-gray-400">Network</p>
                <p className="text-white">{network}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-gray-400">Gas Price</p>
                <p className="text-white">{gasPrice} Gwei</p>
              </div>
            </div>
          </div>
          <SendTransaction account={account} provider={provider} />
        </div>

        {/* Token List and Transaction History */}
        <div className="space-y-6">
          <TokenList account={account} provider={provider} />
          <TransactionHistory account={account} provider={provider} />
        </div>
      </div>
    </div>
  );
}

export default WalletDashboard; 


