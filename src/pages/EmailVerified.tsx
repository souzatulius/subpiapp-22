
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';

const EmailVerified = () => {
  return (
    <AuthLayout leftContent={null}>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Email Verificado com Sucesso
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            Seu cadastro está sendo analisado e aguarda aprovação de um administrador.
          </p>
        </div>
        <p className="text-gray-600 mb-4">
          Você receberá um e-mail assim que seu acesso for liberado.
        </p>
        <p className="text-gray-600 mb-6">
          Obrigado por sua paciência.
        </p>
        <Link 
          to="/login" 
          className="block w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-2xl"
        >
          Voltar para Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default EmailVerified;
