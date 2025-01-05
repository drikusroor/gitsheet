import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false, isLoading: true });

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        setIsAuthenticated(res.ok);
        if (!res.ok && router.pathname !== '/login') {
          router.push('/login');
        }
      } catch {
        setIsAuthenticated(false);
        if (router.pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router.pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
