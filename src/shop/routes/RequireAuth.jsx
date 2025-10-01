import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth() {
  const { userCode, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!userCode) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  return <Outlet />;
}
