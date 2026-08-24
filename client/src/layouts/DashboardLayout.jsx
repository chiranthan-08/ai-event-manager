import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  Palette,
  Sparkles,
  Ticket,
  BookOpen,
  X,
} from 'lucide-react';

const roleLabels = {
  admin: 'Admin Panel',
  employee: 'Employee Portal',
  client: 'Client Portal',
};

const roleAccent = {
  admin: 'bg-violet-100 text-violet-700',
  employee: 'bg-emerald-100 text-emerald-700',
  client: 'bg-amber-100 text-amber-700',
};

const mobileMenuConfig = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Clients', path: '/admin/clients', icon: Users },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Decorations', path: '/admin/decorations', icon: Palette },
    { label: 'AI Assistant', path: '/admin/ai-assistant', icon: Sparkles },
  ],
  employee: [
    { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'My Events', path: '/employee/events', icon: Calendar },
    { label: 'AI Assistant', path: '/employee/ai-assistant', icon: Sparkles },
  ],
  client: [
    { label: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/client/bookings', icon: BookOpen },
    { label: 'Tickets', path: '/client/tickets', icon: Ticket },
    { label: 'AI Assistant', path: '/client/ai-assistant', icon: Sparkles },
  ],
};

const roleGradient = {
  admin: 'from-violet-500 to-indigo-500',
  employee: 'from-emerald-500 to-teal-500',
  client: 'from-amber-500 to-orange-500',
};

export default function DashboardLayout({ role = 'client' }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const initials = displayName.charAt(0).toUpperCase();

  const mobileMenuItems = mobileMenuConfig[role] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="text-xl font-bold text-primary-600">
            AI Event Manager
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${roleGradient[role]} rounded-full flex items-center justify-center`}
            >
              <span className="text-sm font-medium text-white">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {mobileMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setMobileSidebarOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="hidden lg:block">
        <Sidebar role={role} />
      </div>

      <div className="lg:ml-64 transition-all duration-300">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                        <p className="text-sm text-gray-700">
                          Welcome to the {roleLabels[role]}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Just now</p>
                      </div>
                      <div className="px-4 py-3 text-center text-sm text-gray-400">
                        No more notifications
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {initials}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{role}</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden md:block text-gray-400 transition-transform ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">{displayEmail}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${roleAccent[role]}`}
                      >
                        {role}
                      </span>
                    </div>
                    <Link
                      to={`/${role}/dashboard`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
