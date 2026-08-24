import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();

  const user = null;
  const userRole = null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
}
