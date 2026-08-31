import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const decoded = await login(email, password);
      if (decoded?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (decoded?.role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Error handled by auth context toast
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = await googleLogin(credentialResponse.credential);
      if (decoded?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (decoded?.role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // handled by context
    }
  };

  const handleGoogleError = () => {
    // toast handled in context, but silently ignore here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-10">🪔</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-10">🪔</div>
      <div className="absolute top-1/4 right-1/4 text-4xl opacity-5">💐</div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🪔</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Login to manage your events</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Tricolor accent */}
          <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-indian-green rounded-full mb-8"></div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-saffron-500 focus:ring-saffron-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-saffron-500 hover:text-saffron-600 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-indian text-white py-3 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Divider - OR - matching existing design */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400 font-medium px-2">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Login - matches existing rounded-xl, border, shadow style */}
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="100%"
              logo_alignment="center"
            />
            {/* Fallback custom styled button for perfect design match - hidden GoogleLogin handles auth, this is shown if Google script blocked */}
            <noscript>
              <div className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 bg-white text-gray-700 font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </div>
            </noscript>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">Secure authentication via Google</p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-saffron-50 to-amber-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="font-bold text-indian-gold">Client</span>
                <span className="text-gray-500">client@example.com</span>
                <span className="text-gray-400 font-mono">client123</span>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="font-bold text-indian-green">Organizer</span>
                <span className="text-gray-500">priya@example.com</span>
                <span className="text-gray-400 font-mono">employee123</span>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="font-bold text-saffron-500">Admin</span>
                <span className="text-gray-500">admin@example.com</span>
                <span className="text-gray-400 font-mono">admin123</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-saffron-500 hover:text-saffron-600 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
