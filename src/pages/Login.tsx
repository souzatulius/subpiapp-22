
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import EmailSuffix from '@/components/EmailSuffix';
import PasswordRequirements from '@/components/PasswordRequirements';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
import FeatureCard from '@/components/FeatureCard';

const Login = () => {
  const navigate = useNavigate();
  const { 
    password, 
    setPassword, 
    showRequirements, 
    setShowRequirements,
    requirements 
  } = usePasswordValidation();
  
  const { signIn, signInWithGoogle, loading: authLoading } = useAuth();
  
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
      }
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setError(err.message || 'Erro ao tentar fazer login');
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

  const leftContent = (
    <div className="max-w-xl">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
        <span className="text-subpi-blue">Demandas da nossa SUB</span>
        <br />
        <span className="text-subpi-orange">com eficiência</span>
      </h1>
      
      <p className="text-subpi-gray-secondary text-lg mb-8">
        Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard type="demandas" />
        <FeatureCard type="acoes" />
        <FeatureCard type="relatorios" />
      </div>
    </div>
  );

  if (loading || authLoading) {
    return (
      <AuthLayout leftContent={leftContent}>
        <div className="h-full flex items-center justify-center p-8">
          <div className="loading-spinner animate-spin"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout leftContent={leftContent}>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-subpi-gray-text mb-2">Entrar</h2>
        <p className="text-subpi-gray-secondary mb-6">Digite seu e-mail e senha para acessar o sistema</p>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-subpi-gray-text mb-1">
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
              {emailError && (
                <p className="mt-1 text-sm text-subpi-orange">E-mail é obrigatório</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-subpi-gray-text">
                  Senha
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowRequirements(true)}
                  className="login-input pr-10"
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
              
              {error && (
                <p className="mt-2 text-sm text-subpi-orange">{error}</p>
              )}
              
              <div className="text-right mt-2">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-subpi-gray-secondary hover:text-subpi-blue"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              <LogIn className="mr-2 h-5 w-5" /> Entrar
            </button>
            
            <div className="relative flex items-center justify-center mt-4">
              <hr className="w-full border-gray-300" />
              <span className="px-3 text-xs uppercase text-subpi-gray-secondary bg-white">OU CONTINUE COM</span>
              <hr className="w-full border-gray-300" />
            </div>
            
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 text-subpi-gray-text py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
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
        
        <p className="mt-6 text-center text-sm text-subpi-gray-secondary">
          Não tem uma conta? <a href="/register" className="text-subpi-blue hover:underline">Registre-se</a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
