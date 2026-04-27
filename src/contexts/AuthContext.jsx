import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getUser, setUser, setToken } from '../lib/api';
import { fetchMe, logout as doLogout } from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (user) {
          const me = await fetchMe();
          if (mounted) setUserState(me);
        }
      } catch {
        if (mounted) {
          setToken('');
          setUser(null);
          setUserState(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => {
    return {
      user,
      loading,
      setUser: (u) => {
        setUser(u);
        setUserState(u);
      },
      logout: () => {
        doLogout();
        setUserState(null);
      },
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

