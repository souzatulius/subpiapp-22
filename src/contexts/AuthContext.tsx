
import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isApproved: boolean | null;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
