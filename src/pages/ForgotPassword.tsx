
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import EmailSuffix from '@/components/EmailSuffix';
import AuthLayout from '@/components/AuthLayout';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setEmailError(true);
      return;
    }
    
    // Simulate sending reset email
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
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
        {submitted ? (
          <div className="text-center">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
              <p className="font-medium">E-mail enviado com sucesso!</p>
              <p className="mt-1">Verifique sua caixa de entrada para redefinir sua senha.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-subpi-blue hover:underline flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para o login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-subpi-gray-text mb-2">Esqueci minha senha</h2>
            <p className="text-subpi-gray-secondary mb-6">
              Informe seu e-mail para receber instruções de redefinição de senha.
            </p>
            
            <form onSubmit={handleSubmit}>
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
                >
                  <Send className="mr-2 h-5 w-5" /> Enviar instruções
                </button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-subpi-gray-secondary hover:text-subpi-blue mt-4 inline-flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para o login
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

// Importing at the end to avoid circular dependency
import FeatureCard from '@/components/FeatureCard';

export default ForgotPassword;
