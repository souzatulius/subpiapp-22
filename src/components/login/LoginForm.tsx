
import React, { useState, useRef } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmailSuffix from '@/components/EmailSuffix';
import PasswordRequirements from '@/components/PasswordRequirements';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from '@/components/ui/use-toast';
import AttentionBox from '@/components/ui/attention-box';
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
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full md:max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso ao Sistema</h1>
        <p className="text-gray-600">Entre com suas credenciais para acessar</p>
      </div>

      <form ref={formRef} onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <EmailSuffix
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            error={emailError}
            onFocus={scrollToForm}
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">Email é obrigatório</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <Link to="/esqueci-senha" className="text-xs text-blue-600 hover:text-blue-800">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowRequirements(true)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {showRequirements && (
            <PasswordRequirements requirements={requirements} />
          )}
        </div>

        <button
          type="submit"
          disabled={loading || authLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-medium flex items-center justify-center"
        >
          {(loading || authLoading) ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            <span className="flex items-center">
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </span>
          )}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 flex-grow"></div>
          <span className="mx-2 text-xs text-gray-500">ou</span>
          <div className="border-t border-gray-200 flex-grow"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || authLoading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-xl font-medium hover:bg-gray-50 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
            <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
            <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
            <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
          </svg>
          Google
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
