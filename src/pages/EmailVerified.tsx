
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, InfoIcon } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

const EmailVerified = () => {
  const { user } = useAuth();
  
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center w-full max-w-md p-8 mx-auto space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-4 text-center">
          {user ? (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          ) : (
            <InfoIcon className="w-16 h-16 text-blue-500" />
          )}
          
          <h1 className="text-3xl font-bold">
            {user ? 'Email Verificado' : 'Verifique seu Email'}
          </h1>
          
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg flex items-start space-x-3">
            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-medium">Solicitação em análise</p>
              <p className="text-sm mt-1">
                Seu cadastro foi recebido e está pendente de aprovação por um administrador.
                Você receberá um email quando seu acesso for aprovado.
              </p>
            </div>
          </div>
          
          <p className="text-gray-600">
            {user
              ? 'Aguarde a aprovação do seu acesso por um administrador.'
              : 'Enviamos um link para confirmar seu email. Por favor, verifique sua caixa de entrada.'}
          </p>
        </div>
        
        <div className="w-full pt-4 space-y-3">
          <Button asChild className="w-full">
            <Link to="/login">Voltar para Login</Link>
          </Button>
          
          <p className="text-sm text-center text-gray-500">
            Precisa de ajuda? Entre em contato com o administrador do sistema.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerified;
