
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import EmailSuffix from '@/components/EmailSuffix';
import { supabase } from '@/integrations/supabase/client';
import { completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from '@/components/ui/use-toast';
import FeatureCard from '@/components/FeatureCard';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError(true);
      return;
    }
    
    setEmailError(false);
    setLoading(true);
    
    try {
      const completeEmail = completeEmailWithDomain(email);
      const { error } = await supabase.auth.resetPasswordForEmail(completeEmail, {
        redirectTo: `${window.location.origin}/resetar-senha`,
      });
      
      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSuccess(true);
      }
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o email de recuperação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  if (loading) {
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
        <Link to="/login" className="inline-flex items-center text-subpi-gray-secondary hover:text-subpi-blue mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao login
        </Link>
        
        <h2 className="text-2xl font-bold text-subpi-gray-text mb-2">Recuperar Senha</h2>
        
        {success ? (
          <div className="text-center py-6">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <p className="text-green-700">
                Enviamos um e-mail para <strong>{completeEmailWithDomain(email)}</strong> com instruções para redefinir sua senha.
              </p>
            </div>
            <p className="text-subpi-gray-secondary mb-4">
              Verifique sua caixa de entrada e siga as instruções do e-mail para criar uma nova senha.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center text-subpi-blue hover:underline"
            >
              Voltar para a página de login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-subpi-gray-secondary mb-6">
              Digite seu e-mail para receber um link de recuperação de senha.
            </p>
            
            <form onSubmit={handleResetPassword}>
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
                
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={loading}
                >
                  Enviar link de recuperação
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
