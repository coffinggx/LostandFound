import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('user_profile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const storedUser = readStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
      return;
    }

    authApi
      .getCurrentUser(token)
      .then((profile) => {
        localStorage.setItem('user_profile', JSON.stringify(profile));
        localStorage.setItem('user_role', profile.role || 'user');
        setUser(profile);
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_profile');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_profile');
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
