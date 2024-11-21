import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './common/Toast';

function Navbar({ account, connectWallet }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Successfully logged out', 'success');
    navigate('/login');
  };

  const handleConnectWallet = async () => {
    if (!user) {
      addToast('Please login first', 'error');
      navigate('/login');
      return;
    }
    await connectWallet();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigate(user ? '/' : '/login')}
            >
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div className="text-2xl font-bold text-white">Crypto Wallet</div>
            </div>
            
            {/* Only show navigation items if user is logged in and wallet is connected */}
            {user && account && (
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/wallet')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Wallet
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-white/70 bg-white/10 px-4 py-2 rounded-lg">
                  {user.email}
                </div>
                {!account && (
                  <button
                    onClick={handleConnectWallet}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Connect Wallet</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>Logout</span>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                </button>
              </div>
            )}
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 