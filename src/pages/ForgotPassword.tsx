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
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(completeEmail, {
        redirectTo: `${window.location.origin}/resetar-senha`
      });
      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setSuccess(true);
      }
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o email de recuperação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const leftContent = <div className="max-w-xl">
      <h1 className="text-4xl font-bold leading-tight mb-6 md:text-8xl">
        <span className="text-[#002855]">Demandas</span><br />
        <span className="text-[#002855]">da SUB com</span><br />
        
        <span className="text-[#f57c35]">eficiência</span>
      </h1>
      
      <p className="text-gray-600 text-lg mb-8">
        Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard type="demandas" />
        <FeatureCard type="acoes" />
        <FeatureCard type="relatorios" />
      </div>
    </div>;
  if (loading) {
    return <AuthLayout leftContent={leftContent}>
        <div className="h-full flex items-center justify-center p-8">
          <div className="loading-spinner animate-spin"></div>
        </div>
      </AuthLayout>;
  }
  return <AuthLayout leftContent={leftContent}>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full px-[15px] py-[15px]">
        <Link to="/login" className="inline-flex items-center text-[#f57c35] hover:text-text-[#f57c35] mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao login
        </Link>
        
        <h2 className="text-2xl font-bold text-[#111827] mb-2">Recuperar Senha</h2>
        
        {success ? <div className="text-center py-6">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <p className="text-green-700">
                Enviamos um e-mail para <strong>{completeEmailWithDomain(email)}</strong> com instruções para redefinir sua senha.
              </p>
            </div>
            <p className="text-[#6B7280] mb-4">
              Verifique sua caixa de entrada e siga as instruções do e-mail para criar uma nova senha.
            </p>
            <Link to="/login" className="inline-flex items-center text-[#003570] hover:underline">
              Voltar para a página de login
            </Link>
          </div> : <>
            <p className="text-[#6B7280] mb-6">
              Digite seu e-mail para receber um link de recuperação de senha.
            </p>
            
            <form onSubmit={handleResetPassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
                    E-mail
                  </label>
                  <EmailSuffix id="email" value={email} onChange={setEmail} suffix="@smsub.prefeitura.sp.gov.br" error={emailError} placeholder="seu.email" />
                  {emailError && <p className="mt-1 text-sm text-[#f57b35]">E-mail é obrigatório</p>}
                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-xl">
                  Enviar link de recuperação
                </button>
              </div>
            </form>
          </>}
      </div>
    </AuthLayout>;
};
export default ForgotPassword;