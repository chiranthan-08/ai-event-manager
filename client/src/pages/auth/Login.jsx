import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else if (user?.role === 'employee') navigate('/employee/dashboard');
      else navigate('/client/dashboard');
    } catch (err) {
      // Error handled by auth context
    } finally {
      setLoading(false);
    }
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

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-saffron-50 to-amber-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="font-bold text-saffron-500">Admin</div>
                <div className="text-gray-500">admin@example.com</div>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="font-bold text-indian-green">Employee</div>
                <div className="text-gray-500">priya@example.com</div>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="font-bold text-indian-gold">Client</div>
                <div className="text-gray-500">client@example.com</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Password: admin123 / employee123 / client123</p>
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
