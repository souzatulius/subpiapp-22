
import React from 'react';
import FeatureCard from '@/components/FeatureCard';

const LoginLeftContent: React.FC = () => {
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

export default LoginLeftContent;
