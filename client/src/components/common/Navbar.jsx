import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, ChevronDown, Sparkles, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'employee': return '/employee/dashboard';
      case 'client': return '/client/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b-2 border-saffron-500">
      {/* Tricolor top bar */}
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-indian-green"></div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-saffron-500/30 transition-shadow">
              <span className="text-white font-bold text-lg">🪔</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-saffron-500 to-indian-red bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
                AI Event Manager
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/decorations">Decorations</NavLink>
            <NavLink to="/add-ons">Add-Ons</NavLink>
            <NavLink to="/ai-assistant" highlight>
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </NavLink>
            {isAuthenticated && user?.role === 'client' && (
              <NavLink to="/client/dashboard">
                <Calendar className="w-4 h-4" />
                My Dashboard
              </NavLink>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-saffron-500 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-gradient-to-r from-saffron-50 to-amber-50 border border-saffron-200 px-4 py-2 rounded-xl hover:from-saffron-100 hover:to-amber-100 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{user?.name || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-medium text-gray-800">{user?.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-saffron-50 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-saffron-500 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-indian text-white px-6 py-2 rounded-xl font-semibold shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/events" onClick={() => setIsOpen(false)}>Events</MobileNavLink>
            <MobileNavLink to="/decorations" onClick={() => setIsOpen(false)}>Decorations</MobileNavLink>
            <MobileNavLink to="/add-ons" onClick={() => setIsOpen(false)}>Add-Ons</MobileNavLink>
            <MobileNavLink to="/cart" onClick={() => setIsOpen(false)}>
              <ShoppingCart className="w-4 h-4 text-saffron-500" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </MobileNavLink>
            <MobileNavLink to="/ai-assistant" onClick={() => setIsOpen(false)}>
              <Sparkles className="w-4 h-4 text-saffron-500" />
              AI Assistant
            </MobileNavLink>

            <div className="border-t border-gray-100 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <div className="font-medium text-gray-800">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-saffron-50 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2 border border-saffron-500 text-saffron-500 rounded-xl font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2 btn-indian text-white rounded-xl font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children, highlight }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
        highlight
          ? 'text-saffron-500 hover:bg-saffron-50'
          : 'text-gray-700 hover:text-saffron-500 hover:bg-saffron-50'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-saffron-50 rounded-xl font-medium"
    >
      {children}
    </Link>
  );
}
