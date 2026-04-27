import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  if (roles && roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/forbidden" replace />;
  return children;
}

