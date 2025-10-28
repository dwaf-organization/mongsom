import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth() {
  const { userCode, loading } = useAuth();
  const location = useLocation();

  if (!userCode || userCode !== 20) {
    if (loading) return null;
    return <Navigate to='/admin' replace state={{ from: location }} />;
  }
  return <Outlet />;
}
