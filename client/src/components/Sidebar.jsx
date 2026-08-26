import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  Palette,
  Sparkles,
  Ticket,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Package,
  Settings,
} from 'lucide-react';

const menuConfig = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Bookings', path: '/admin/bookings', icon: BookOpen },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Clients', path: '/admin/clients', icon: Users },
    { label: 'Add-Ons', path: '/admin/add-ons', icon: Package },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Decorations', path: '/admin/decorations', icon: Palette },
    { label: 'AI Assistant', path: '/admin/ai-assistant', icon: Sparkles },
  ],
  employee: [
    { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'My Events', path: '/employee/events', icon: Calendar },
    { label: 'Bookings', path: '/employee/bookings', icon: BookOpen },
    { label: 'Clients', path: '/employee/clients', icon: Users },
    { label: 'Payments', path: '/employee/payments', icon: CreditCard },
    { label: 'Decorations', path: '/employee/decorations', icon: Palette },
    { label: 'Add-Ons', path: '/employee/add-ons', icon: Package },
    { label: 'Settings', path: '/employee/settings', icon: Settings },
    { label: 'AI Assistant', path: '/employee/ai-assistant', icon: Sparkles },
  ],
  client: [
    { label: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/client/bookings', icon: BookOpen },
    { label: 'Tickets', path: '/client/tickets', icon: Ticket },
    { label: 'Settings', path: '/client/settings', icon: Settings },
    { label: 'AI Assistant', path: '/client/ai-assistant', icon: Sparkles },
  ],
};

const roleColors = {
  admin: 'from-violet-500 to-indigo-500',
  employee: 'from-emerald-500 to-teal-500',
  client: 'from-amber-500 to-orange-500',
};

const roleDisplayName = {
  admin: 'Admin',
  employee: 'Event Organizer',
  client: 'Client',
};

export default function Sidebar({ role = 'client', user = null }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const menuItems = menuConfig[role] || [];

  const displayName = user?.name || 'User';
  const displayOrgId = user?.organizerId || null;
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-gray-100 fixed top-16 bottom-0 left-0 z-40 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className={`p-4 border-b border-gray-100 ${collapsed ? 'px-3' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 bg-gradient-to-br ${roleColors[role]} rounded-full flex items-center justify-center`}>
              <span className="text-sm font-medium text-white">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              {role === 'employee' && displayOrgId ? (
                <p className="text-xs font-mono font-medium text-emerald-600">{displayOrgId}</p>
              ) : (
                <p className="text-xs text-gray-500">{roleDisplayName[role] || role}</p>
              )}
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center mb-2">
            <div className={`w-10 h-10 bg-gradient-to-br ${roleColors[role]} rounded-full flex items-center justify-center`}>
              <span className="text-sm font-medium text-white">{initials}</span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 space-y-1">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
