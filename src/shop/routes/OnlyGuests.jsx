import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OnlyGuests() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (user)
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  return <Outlet />;
}
