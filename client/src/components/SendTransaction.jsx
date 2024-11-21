import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../components/common/Toast';

function SendTransaction({ account, provider }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provider || !account) return;

    try {
      setLoading(true);
      
      // Basic validation
      if (!ethers.utils.isAddress(recipient)) {
        throw new Error('Invalid recipient address');
      }
      
      if (parseFloat(amount) <= 0) {
        throw new Error('Invalid amount');
      }

      // Get signer for sending transaction
      const signer = provider.getSigner();
      
      // Estimate gas
      const gasEstimate = await signer.estimateGas({
        to: recipient,
        value: ethers.utils.parseEther(amount)
      });

      // Send transaction
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount),
        gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
      });

      addToast('Transaction sent! Waiting for confirmation...', 'info');

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      addToast('Transaction confirmed!', 'success');
      
      // Clear form
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transaction error:', error);
      addToast(error.message || 'Transaction failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Send ETH</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="0x..."
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Amount (ETH)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="0.0"
            step="0.0001"
            min="0"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !account}
          className={`w-full py-3 rounded-lg font-semibold ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
          } text-white transition-all duration-200`}
        >
          {loading ? 'Sending...' : 'Send Transaction'}
        </button>
      </form>
    </div>
  );
}

export default SendTransaction; 