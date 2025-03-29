import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // <-- import necessário
import EmailSuffix from '@/components/EmailSuffix';
import PasswordRequirements from '@/components/PasswordRequirements';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from '@/components/ui/use-toast';
import AttentionBox from '@/components/ui/attention-box';

const LoginForm = () => {
  const navigate = useNavigate(); // <-- hook do react-router-dom

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

        navigate('/dashboard'); // <-- redireciona ao sucesso
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

      <form onSubmit={handleLogin}>
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
            <PasswordRequirements requirements={requirements} visible={showRequirements && password.length > 0} />
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
            <svg className="mr-2" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="..."></path>
              <path fill="#FF3D00" d="..."></path>
              <path fill="#4CAF50" d="..."></path>
              <path fill="#1976D2" d="..."></path>
            </svg>
            Entrar com Google (@smsub.prefeitura.sp.gov.br)
          </button>

          <AttentionBox title="Importante:">
            <p>Use uma conta do domínio @smsub.prefeitura.sp.gov.br</p>
          </AttentionBox>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B7280]">
        Não tem uma conta? <Link to="/register" className="text-[#f57c35] font-semibold hover:underline">Registre-se</Link>
      </p>
    </div>
  );
};

export default LoginForm;
