import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth() {
  const { userCode, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or 스피너

  if (!userCode) {
    // 로그인 안됨 → 로그인 페이지로 보내되, 돌아올 곳 저장
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  return <Outlet />;
}
