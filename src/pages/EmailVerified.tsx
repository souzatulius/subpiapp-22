import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import AttentionBox from '@/components/ui/attention-box';
const EmailVerified = () => {
  return <AuthLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full mx-[60px] px-[20px]">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Email Verificado com Sucesso
        </h2>
        
        <AttentionBox title="Aguardando aprovação" className="mb-6">
          Seu cadastro está sendo analisado e aguarda aprovação de um administrador.
        </AttentionBox>
        
        <p className="text-gray-600 mb-4">
          Você receberá um e-mail assim que seu acesso for liberado.
        </p>
        <p className="text-gray-600 mb-6">
          Obrigado por sua paciência.
        </p>
        <Link to="/login" className="block w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-xl shadow-sm hover:shadow-md">
          Voltar para Login
        </Link>
      </div>
    </AuthLayout>;
};
export default EmailVerified;