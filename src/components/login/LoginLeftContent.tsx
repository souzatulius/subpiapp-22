import React from 'react';
import FeatureCard from '@/components/FeatureCard';
const LoginLeftContent: React.FC = () => {
  return <div className="max-w-xl">
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
};
export default LoginLeftContent;