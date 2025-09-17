// src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

const AuthContext = createContext(null);
const SS_KEY = 'auth_session'; // 세션에 저장할 키

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { userId, ... }
  const [userCode, setUserCode] = useState(null); // number | string
  const [loading, setLoading] = useState(true);

  // 새로고침 시 sessionStorage에서 복원
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setUserCode(parsed.userCode ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!userCode; // userCode 존재 여부로 로그인 판별(간단 버전)

  const login = useCallback(({ userData, userCode }) => {
    setUser(userData || null);
    setUserCode(userCode ?? null);

    sessionStorage.setItem(
      SS_KEY,
      JSON.stringify({ user: userData || null, userCode: userCode ?? null }),
    );
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUserCode(null);
    sessionStorage.removeItem(SS_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, userCode, isAuthenticated, loading, login, logout }),
    [user, userCode, isAuthenticated, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
