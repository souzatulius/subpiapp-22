
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { useLoginForm } from '@/components/login/useLoginForm';
import LoginFormFields from '@/components/login/LoginFormFields';
import GoogleLoginButton from '@/components/login/GoogleLoginButton';
const LoginForm = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    email,
    password,
    loading,
    authLoading,
    emailError,
    passwordError,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    handleGoogleLogin
  } = useLoginForm(navigate);
  if (loading || authLoading) {
    return <div className="h-full flex items-center justify-center p-8">
        <div className="animate-spin w-10 h-10 border-4 border-[#003570] border-t-transparent rounded-full" />
      </div>;
  }
  return <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-slate-900">Entrar</h2>
      <p className="text-[#6B7280] mb-6">Digite seu e-mail e senha para acessar a plataforma.</p>

      <form id="login-form" ref={formRef} onSubmit={handleLogin}>
        <div className="space-y-4">
          <LoginFormFields email={email} password={password} emailError={emailError} passwordError={passwordError} onEmailChange={handleEmailChange} onPasswordChange={handlePasswordChange} />

          {/* Botão principal de login */}
          <button type="submit" disabled={loading} className="w-full bg-[#003570] text-white py-3 px-6 text-base font-semibold flex items-center justify-center rounded-xl hover:bg-[#002c6d] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <LogIn className="mr-2 h-5 w-5" />
            Entrar
          </button>

          <div className="relative flex items-center justify-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="text-xs uppercase text-[#6B7280] bg-white px-4 absolute">OU</span>
          </div>

          {/* Login com Google */}
          <GoogleLoginButton onGoogleLogin={handleGoogleLogin} />
        </div>
      </form>

      <div className="mt-6 text-center space-y-2">
        {/* Nova mensagem para cadastro */}
        <p className="text-sm text-[#6B7280]">
          Não tem login?{' '}
          <Link to="/register" className="text-[#003570] font-semibold hover:underline">
            Faça o seu cadastro
          </Link>
        </p>
      </div>
    </div>;
};
export default LoginForm;
