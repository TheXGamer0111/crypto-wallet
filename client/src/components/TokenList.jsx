import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../components/common/Toast';
import Loading from './common/Loading';

// Minimal ERC20 ABI for token interactions
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

// Common token addresses (you can add more)
const COMMON_TOKENS = {
  'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F'
};

function TokenList({ account, provider }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchTokenBalances = async () => {
    if (!provider || !account) return;

    try {
      const tokenPromises = Object.entries(COMMON_TOKENS).map(async ([symbol, address]) => {
        const contract = new ethers.Contract(address, ERC20_ABI, provider);
        const [balance, decimals, name] = await Promise.all([
          contract.balanceOf(account),
          contract.decimals(),
          contract.name()
        ]);

        return {
          symbol,
          address,
          name,
          balance: ethers.utils.formatUnits(balance, decimals),
          decimals
        };
      });

      const tokenData = await Promise.all(tokenPromises);
      setTokens(tokenData.filter(token => parseFloat(token.balance) > 0));
    } catch (error) {
      console.error('Error fetching token balances:', error);
      addToast('Failed to fetch token balances', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenBalances();
    const interval = setInterval(fetchTokenBalances, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [provider, account]);

  if (loading) return <Loading />;

  return (
    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Token Balances</h2>
      
      <div className="space-y-4">
        {tokens.length > 0 ? (
          tokens.map((token) => (
            <div
              key={token.address}
              className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">{token.name}</p>
                  <p className="text-gray-400 text-sm">{token.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono">
                    {parseFloat(token.balance).toFixed(4)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {token.address.slice(0, 6)}...{token.address.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            No tokens found for this wallet
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenList;