import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

const AuthContext = createContext(null);
const SS_KEY = 'auth_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userCode, setUserCode] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const isAuthenticated = !!userCode;

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
