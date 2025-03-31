import React, { useState, useRef } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmailSuffix from '@/components/EmailSuffix';
import PasswordRequirements from '@/components/PasswordRequirements';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const LoginForm = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const formRef = useRef<HTMLFormElement>(null);

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
    isLoading: authLoading
  } = useAuth();

  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(false);

    if (!email.trim()) {
      setEmailError(true);
      return;
    }

    setLoading(true);

    try {
      const completeEmail = completeEmailWithDomain(email);
      const { error } = await signIn(completeEmail, password);

      if (error) {
        showAuthError(error);
      } else {
        toast({
          title: 'Login efetuado',
          description: 'Você foi autenticado com sucesso.',
          variant: 'success'
        });

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
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      toast({
        title: "Redirecionando para o Google",
        description: "Use uma conta @smsub.prefeitura.sp.gov.br"
      });
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Erro no login com Google",
        description: "Falha ao conectar com o Google",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    if (isMobile && formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  if (loading || authLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="animate-spin w-10 h-10 border-4 border-[#003570] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full">
      <h2 className="text-2xl font-bold mb-2 text-slate-900">Entrar</h2>
      <p className="text-[#6B7280] mb-6">Digite seu e-mail e senha para acessar a plataforma.</p>

      <form id="login-form" ref={formRef} onSubmit={handleLogin}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">E-mail</label>
            <EmailSuffix
              id="email"
              value={email}
              onChange={setEmail}
              suffix="@smsub.prefeitura.sp.gov.br"
              error={emailError}
              placeholder="seu.email"
            />
            {emailError && <p className="text-sm text-[#f57b35]">E-mail é obrigatório</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">Senha</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setShowRequirements(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003570]"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            <PasswordRequirements 
              password={password}
              requirements={requirements} 
              visible={showRequirements && password.length > 0} 
            />
            <div className="mt-2">
              <Link to="/forgot-password" className="text-[#f57c35] font-semibold hover:underline">Esqueceu sua senha?</Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 flex items-center justify-center rounded-xl"
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
            className="w-full border border-gray-300 py-3 rounded-xl flex justify-center items-center"
          >
            <svg className="mr-2" width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.944l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.801 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Google
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
