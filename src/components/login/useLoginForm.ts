
import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from '@/components/ui/use-toast';

export const useLoginForm = (navigate: NavigateFunction) => {
  const {
    signIn,
    signInWithGoogle,
    isLoading: authLoading
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (emailError) setEmailError(false);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (passwordError) setPasswordError(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    let hasError = false;
    
    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    setIsSubmitting(true);

    try {
      const completeEmail = completeEmailWithDomain(email);
      const { error } = await signIn(completeEmail, password);

      if (error) {
        showAuthError(error);
      } else {
        // Success toast removed from here
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast({
        title: 'Erro de login',
        description: err.message || 'Erro ao tentar fazer login',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Erro no login com Google",
        description: "Falha ao conectar com o Google",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    loading,
    authLoading,
    emailError,
    passwordError,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    handleGoogleLogin
  };
};
