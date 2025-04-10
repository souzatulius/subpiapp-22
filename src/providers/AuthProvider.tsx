
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupAuthListener, signIn, signOut } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: any;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => Promise.resolve({ data: null, error: null }),
  signOut: () => Promise.resolve({ error: null }),
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth status
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
        
        if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
          navigate('/dashboard');
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signIn(email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const result = await signOut();
      return result;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
