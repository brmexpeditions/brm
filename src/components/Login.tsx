import React, { useState } from 'react';

interface LoginProps {
  companyName: string;
  logo?: string;
  primaryColor?: string;
  onLogin: (username: string, password: string) => boolean;
  onSkip?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  companyName,
  logo,
  primaryColor = '#1e40af',
  onLogin,
  onSkip
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = onLogin(username, password);
    
    if (!success) {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}aa 100%)` 
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div 
          className="p-8 text-center text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {logo ? (
            <img 
              src={logo} 
              alt={companyName} 
              className="w-20 h-20 mx-auto mb-4 object-contain bg-white rounded-xl p-2"
            />
          ) : (
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center text-4xl">
              🏍️
            </div>
          )}
          <h1 className="text-2xl font-bold">{companyName || 'Fleet Manager'}</h1>
          <p className="text-white/80 text-sm mt-1">Motorcycle Fleet Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip Login (Demo Mode)
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800">
              <strong>Default Credentials:</strong><br />
              Username: <code className="bg-white px-2 py-0.5 rounded">admin</code><br />
              Password: <code className="bg-white px-2 py-0.5 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
