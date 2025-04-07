
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import AttentionBox from '@/components/ui/attention-box';

const EmailVerified = () => {
  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Cadastro Realizado com Sucesso
        </h2>
        
        <AttentionBox title="Verificação de Email" className="mb-6">
          Por favor, verifique seu email para validar o seu cadastro. Após a validação, seu acesso será aprovado por um administrador.
        </AttentionBox>
        
        <p className="text-gray-600 mb-4">
          Enviamos um link de confirmação para o seu email. Clique no link para validar o seu cadastro.
        </p>
        
        <p className="text-gray-600 mb-6">
          Não recebeu o email? Verifique sua pasta de spam ou entre em contato com o suporte.
        </p>
        
        <Link to="/login" className="block w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-xl shadow-sm hover:shadow-md">
          Voltar para Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default EmailVerified;
