
import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import EmailSuffix from '@/components/EmailSuffix';
import { supabase } from '@/integrations/supabase/client';
import { completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [success, setSuccess] = useState(false);
  const isMobile = useIsMobile();
  const formRef = useRef<HTMLFormElement>(null);

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

  const scrollToForm = () => {
    if (isMobile && formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="h-full flex items-center justify-center p-8">
          <div className="loading-spinner animate-spin"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full">
        <Link to="/login" className="inline-flex items-center text-[#f57c35] hover:text-[#f57c35] mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao login
        </Link>
        
        <h2 className="text-2xl font-bold text-[#111827] mb-2">Recuperar Senha</h2>
        
        {success ? (
          <div className="text-center py-6">
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
          </div>
        ) : (
          <>
            <p className="text-[#6B7280] mb-6">
              Digite seu e-mail para receber um link de recuperação de senha.
            </p>
            
            {/* Mobile button removed as requested */}
            
            <form id="recovery-form" ref={formRef} onSubmit={handleResetPassword}>
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
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-xl shadow-sm hover:shadow-md"
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
