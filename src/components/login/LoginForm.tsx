
import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmailSuffix from '@/components/EmailSuffix';
import PasswordRequirements from '@/components/PasswordRequirements';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const {
    password,
    setPassword,
    showRequirements,
    setShowRequirements,
    requirements
  } = usePasswordValidation();
  
  const {
    signIn,
    signInWithGoogle,
    loading: authLoading
  } = useAuth();
  
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setError(null);
    setEmailError(false);

    // Basic validation
    if (!email.trim()) {
      setEmailError(true);
      return;
    }

    // Start loading
    setLoading(true);
    try {
      const completeEmail = completeEmailWithDomain(email);
      const { error } = await signIn(completeEmail, password);
      
      if (error) {
        setError(error.message);
        showAuthError(error);
      } else {
        toast({
          title: "Login efetuado",
          description: "Você foi autenticado com sucesso.",
        });
      }
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setError(err.message || 'Erro ao tentar fazer login');
      toast({
        title: "Erro de login",
        description: err.message || 'Erro ao tentar fazer login',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Erro no login com Google:', error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="loading-spinner animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full">
      <h2 className="text-2xl font-bold mb-2 text-slate-900">Entrar</h2>
      <p className="text-[#6B7280] mb-6">Digite seu e-mail e senha para acessar a plataforma.</p>
      
      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
              E-mail
            </label>
            <EmailSuffix 
              id="email" 
              value={email} 
              onChange={setEmail} 
              suffix="@smsub.prefeitura.sp.gov.br" 
              error={emailError} 
              placeholder="seu.email" 
            />
            {emailError && <p className="mt-1 text-sm text-[#f57b35]">E-mail é obrigatório</p>}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-[#111827]">
                Senha
              </label>
            </div>
            <div className="relative">
              <input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                onFocus={() => setShowRequirements(true)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200 pr-10" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            <PasswordRequirements 
              requirements={requirements} 
              visible={showRequirements && password.length > 0} 
            />
            
            {error && <p className="mt-2 text-sm text-[#f57b35]">{error}</p>}
            
            <div className="mt-2">
              <Link to="/forgot-password" className="text-[#f57c35] font-semibold hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-xl shadow-sm hover:shadow-md"
          >
            <LogIn className="mr-2 h-5 w-5" /> Entrar
          </button>
          
          <div className="relative flex items-center justify-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="text-xs uppercase text-[#6B7280] bg-white px-4 absolute">OU</span>
          </div>
          
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="w-full bg-white border border-gray-300 text-[#111827] py-3 px-4 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center rounded-xl shadow-sm hover:shadow-md"
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="mr-2">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Entrar com Google
          </button>
        </div>
      </form>
      
      <p className="mt-6 text-center text-sm text-[#6B7280]">
        Não tem uma conta? <Link to="/register" className="text-[#f57c35] font-semibold hover:underline">Registre-se</Link>
      </p>
    </div>
  );
};

export default LoginForm;
