import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import ClientLayout from './layouts/ClientLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/public/Home';
import Events from './pages/public/Events';
import EventDetail from './pages/public/EventDetail';
import EmployeeDetail from './pages/public/EmployeeDetail';
import Decorations from './pages/public/Decorations';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import ClientDashboard from './pages/client/ClientDashboard';
import ClientTickets from './pages/client/ClientTickets';
import ClientBookings from './pages/client/ClientBookings';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeEvents from './pages/employee/EmployeeEvents';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminClients from './pages/admin/AdminClients';
import AdminPayments from './pages/admin/AdminPayments';
import AdminDecorations from './pages/admin/AdminDecorations';

import AIAssistant from './pages/ai/AIAssistant';
import AIVisualize from './pages/ai/AIVisualize';

import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'employee') return <Navigate to="/employee/dashboard" replace />;
    return <Navigate to="/client/dashboard" replace />;
  }

  return <Outlet />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
          <Route path="decorations" element={<Decorations />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/client" element={<ClientLayout />}>
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="tickets" element={<ClientTickets />} />
          <Route path="bookings" element={<ClientBookings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="events" element={<EmployeeEvents />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="decorations" element={<AdminDecorations />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['client', 'employee', 'admin']} />}>
        <Route path="/ai-assistant" element={<PublicLayout />}>
          <Route index element={<AIAssistant />} />
        </Route>
        <Route path="/ai-visualize" element={<PublicLayout />}>
          <Route index element={<AIVisualize />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
