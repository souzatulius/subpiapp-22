
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import AttentionBox from '@/components/ui/attention-box';
import { useAuth } from '@/hooks/useSupabaseAuth';

const EmailVerified = () => {
  const { session, isApproved } = useAuth();

  // Determine the message to show based on user status
  const getStatusMessage = () => {
    if (!session) {
      return {
        title: "Cadastro Realizado com Sucesso",
        message: "Por favor, verifique seu email para validar o seu cadastro. Após a validação, seu acesso será aprovado por um administrador."
      };
    } else if (!isApproved) {
      return {
        title: "Aguardando Aprovação",
        message: "Seu email foi verificado com sucesso! Aguarde a aprovação do seu acesso por um administrador do sistema."
      };
    } else {
      return {
        title: "Acesso Aprovado",
        message: "Seu acesso foi aprovado! Você já pode acessar o sistema."
      };
    }
  };

  const status = getStatusMessage();

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          {status.title}
        </h2>
        
        <AttentionBox title={session ? "Status do Acesso" : "Verificação de Email"} className="mb-6">
          {status.message}
        </AttentionBox>
        
        {!session ? (
          <>
            <p className="text-gray-600 mb-4">
              Enviamos um link de confirmação para o seu email. Clique no link para validar o seu cadastro.
            </p>
            
            <p className="text-gray-600 mb-6">
              Não recebeu o email? Verifique sua pasta de spam ou entre em contato com o suporte.
            </p>
          </>
        ) : !isApproved ? (
          <p className="text-gray-600 mb-6">
            Seu cadastro está sendo analisado. Assim que for aprovado, você receberá uma notificação por email.
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            Você já pode acessar todas as funcionalidades do sistema.
          </p>
        )}
        
        <Link to="/login" className="block w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-xl shadow-sm hover:shadow-md">
          {isApproved ? "Acessar o Sistema" : "Voltar para Login"}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default EmailVerified;
