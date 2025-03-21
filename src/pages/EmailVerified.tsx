
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import FeatureCard from '@/components/FeatureCard';

const EmailLeftContent: React.FC = () => {
  return (
    <>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
        <span className="text-[#002855]">Demandas da SUB com </span>
        <span className="text-[#f57c35]">eficiência</span>
      </h1>
      
      <p className="text-gray-600 text-lg mb-8 max-w-xl">
        Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard type="demandas" />
        <FeatureCard type="acoes" />
        <FeatureCard type="relatorios" />
      </div>
    </>
  );
};

const EmailVerified = () => {
  return (
    <AuthLayout leftContent={<EmailLeftContent />}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full">
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
          className="block w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-xl shadow-sm hover:shadow-md"
        >
          Voltar para Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default EmailVerified;
