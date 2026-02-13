import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  companyName: string;
  phone: string;
  createdAt: string;
}

interface AuthScreenProps {
  onLogin: (user: User) => void;
  companySettings: {
    companyName?: string;
    logo?: string;
    primaryColor?: string;
  };
  initialMode?: 'login' | 'signup';
  onBack?: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, companySettings, initialMode = 'login', onBack }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Update mode when initialMode prop changes
  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const getUsers = (): User[] => {
    try {
      const users = localStorage.getItem('fleet_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('fleet_users', JSON.stringify(users));
  };

  // Demo Admin Login - Quick login for admin
  const handleDemoLogin = () => {
    setLoading(true);
    const adminUser: User = {
      id: 'admin',
      username: 'Admin',
      email: 'admin@fleetguard.com',
      password: 'admin123',
      companyName: 'Fleet Guard',
      phone: '',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('fleet_current_user', JSON.stringify(adminUser));
    setTimeout(() => {
      onLogin(adminUser);
      setLoading(false);
    }, 300);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        u => (u.email.toLowerCase() === loginEmail.toLowerCase() || u.username.toLowerCase() === loginEmail.toLowerCase()) 
             && u.password === loginPassword
      );

      if (user) {
        localStorage.setItem('fleet_current_user', JSON.stringify(user));
        onLogin(user);
      } else {
        // Check for default admin
        if ((loginEmail === 'admin' || loginEmail === 'admin@admin.com' || loginEmail === 'admin@fleetguard.com') && loginPassword === 'admin123') {
          const adminUser: User = {
            id: 'admin',
            username: 'Admin',
            email: 'admin@fleetguard.com',
            password: 'admin123',
            companyName: 'Fleet Guard',
            phone: '',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('fleet_current_user', JSON.stringify(adminUser));
          onLogin(adminUser);
        } else {
          setError('Invalid email/username or password');
        }
      }
      setLoading(false);
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    setTimeout(() => {
      // Validation
      if (!signupName.trim()) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      if (!signupEmail.trim() || !signupEmail.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      if (signupPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      if (signupPassword !== signupConfirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const users = getUsers();
      
      // Check if email already exists
      if (users.find(u => u.email.toLowerCase() === signupEmail.toLowerCase())) {
        setError('Email already registered. Please login instead.');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: signupName,
        email: signupEmail,
        password: signupPassword,
        companyName: signupCompany || signupName,
        phone: signupPhone,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      setSuccess('Account created successfully! Please login.');
      setIsLogin(true);
      setLoginEmail(signupEmail);
      setLoginPassword('');
      
      // Clear signup form
      setSignupName('');
      setSignupEmail('');
      setSignupPhone('');
      setSignupCompany('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        )}

        {/* Logo & Company Name */}
        <div className="text-center mb-8">
          {companySettings.logo ? (
            <img 
              src={companySettings.logo} 
              alt="Company Logo" 
              className="w-20 h-20 mx-auto mb-4 rounded-xl bg-white p-2 shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl">
              <span className="text-4xl">🛡️</span>
            </div>
          )}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent mb-2">
            {companySettings.companyName || 'Fleet Guard'}
          </h1>
          <p className="text-gray-400">Vehicle Fleet Management System</p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-4 font-semibold transition-colors ${
                isLogin 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              🔐 Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-4 font-semibold transition-colors ${
                !isLogin 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              ✨ Sign Up
            </button>
          </div>

          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-300 rounded-lg flex items-center gap-2">
                <span>❌</span> {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-500 text-green-300 rounded-lg flex items-center gap-2">
                <span>✅</span> {success}
              </div>
            )}

            {isLogin ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    📧 Email or Username
                  </label>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-amber-500 focus:outline-none text-white"
                    placeholder="Enter your email or username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    🔒 Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-amber-500 focus:outline-none text-white"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/25"
                >
                  {loading ? '⏳ Logging in...' : '🚀 Login'}
                </button>

                {/* Demo Login Button - Quick access for admin */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-gray-600"
                >
                  <span>⚡</span>
                  {loading ? 'Logging in...' : 'Quick Admin Login'}
                </button>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    👤 Full Name *
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-green-500 focus:outline-none text-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    📧 Email Address *
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-green-500 focus:outline-none text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    📱 Phone Number
                  </label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-green-500 focus:outline-none text-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    🏢 Company Name
                  </label>
                  <input
                    type="text"
                    value={signupCompany}
                    onChange={(e) => setSignupCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-green-500 focus:outline-none text-white"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    🔒 Password * (min 6 characters)
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-green-500 focus:outline-none text-white"
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    🔒 Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-green-500 focus:outline-none text-white"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-green-500 transition-all disabled:opacity-50 shadow-lg shadow-green-500/25"
                >
                  {loading ? '⏳ Creating Account...' : '✨ Create Account'}
                </button>

                <p className="text-center text-sm text-gray-400">
                  By signing up, you agree to our Terms of Service
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          © 2026 Fleet Guard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
