
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import PWAButton from '@/components/PWAButton';
import AuthLayout from '@/components/AuthLayout';

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const leftContent = (
    <div className="max-w-xl">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
        <span className="text-subpi-blue">Demandas da nossa SUB</span>
        <br />
        <span className="text-subpi-orange">com eficiência</span>
      </h1>
      
      <p className="text-subpi-gray-secondary text-lg mb-8">
        Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button 
          onClick={handleLogin}
          className="bg-subpi-blue text-white py-3 px-6 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-all duration-200"
        >
          Acessar <ArrowRight className="ml-2 h-5 w-5" />
        </button>
        <button 
          onClick={handleRegister}
          className="border border-subpi-blue text-subpi-blue py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          Solicitar Cadastro
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard type="demandas" />
        <FeatureCard type="acoes" />
        <FeatureCard type="relatorios" />
      </div>
    </div>
  );

  return (
    <AuthLayout leftContent={leftContent}>
      <div className="flex items-center justify-center p-8">
        <img 
          src="/lovable-uploads/ae208fd7-3f16-427a-a087-135128e4be50.png" 
          alt="Logo SUB PI" 
          className="w-72"
        />
      </div>
    </AuthLayout>
  );
};

export default Index;
