
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

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
        console.log('Auth event:', event);
        setUser(session?.user || null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
        
        if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
          navigate('/dashboard');
        }
        
        // Handle email verification confirmation
        if (event === 'USER_UPDATED') {
          const currentPath = window.location.pathname;
          
          // Only redirect to email-verified if coming from auth callback or similar pages
          if (currentPath.includes('/auth/callback') || 
              currentPath.includes('/confirm-email') ||
              currentPath === '/') {
            navigate('/email-verified');
          }
        }
      }
    );
    
    // Check if we're on auth callback page and extract hash parameters
    const handleAuthCallback = () => {
      if (location.pathname === '/auth/callback') {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check if this is an email confirmation
        const type = hashParams.get('type') || queryParams.get('type');
        
        if (type === 'email_confirmation' || type === 'recovery') {
          navigate('/email-verified');
        }
      }
    };
    
    handleAuthCallback();
    
    // Cleanup subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, location.pathname]);

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
