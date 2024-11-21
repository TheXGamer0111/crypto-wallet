import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../components/common/Toast';
import Loading from './common/Loading';

function TransactionHistory({ account, provider }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, sent, received
  const { addToast } = useToast();

  const fetchTransactions = async () => {
    if (!provider || !account) return;

    try {
      // Get the last 100 blocks
      const currentBlock = await provider.getBlockNumber();
      const blocks = await Promise.all(
        Array.from({ length: 100 }, (_, i) => 
          provider.getBlockWithTransactions(currentBlock - i)
        )
      );

      // Filter transactions related to the account
      const accountTxs = blocks
        .flatMap(block => block.transactions)
        .filter(tx => 
          tx.from.toLowerCase() === account.toLowerCase() || 
          tx.to?.toLowerCase() === account.toLowerCase()
        )
        .map(tx => ({
          ...tx,
          timestamp: new Date(blocks.find(b => b.hash === tx.blockHash).timestamp * 1000)
        }));

      setTransactions(accountTxs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      addToast('Failed to fetch transaction history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [provider, account]);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'sent') return tx.from.toLowerCase() === account.toLowerCase();
    if (filter === 'received') return tx.to?.toLowerCase() === account.toLowerCase();
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <div className="flex space-x-2">
          {['all', 'sent', 'received'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg capitalize ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div
              key={tx.hash}
              className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">
                    {tx.from.toLowerCase() === account.toLowerCase() ? 'Sent to' : 'Received from'}
                  </p>
                  <p className="text-white font-mono text-sm">
                    {tx.from.toLowerCase() === account.toLowerCase() ? tx.to : tx.from}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {tx.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    tx.from.toLowerCase() === account.toLowerCase() 
                      ? 'text-red-400' 
                      : 'text-green-400'
                  }`}>
                    {tx.from.toLowerCase() === account.toLowerCase() ? '-' : '+'}
                    {ethers.utils.formatEther(tx.value)} ETH
                  </p>
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory; 