
import { useState, FormEvent } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { signIn, signInWithGoogle } from '@/services/authService';
import { toast } from '@/components/ui/use-toast';

export const useLoginForm = (navigate: NavigateFunction) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    setEmailError(false);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordError(false);
  };

  const validateForm = () => {
    let valid = true;
    if (!email.trim()) {
      setEmailError(true);
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError(true);
      valid = false;
    }
    return valid;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Erro ao fazer login",
          description: error.message || "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Erro ao fazer login com Google",
        description: "Ocorreu um erro durante o login com Google. Tente novamente mais tarde.",
        variant: "destructive",
      });
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
    handleGoogleLogin,
  };
};

export default useLoginForm;
