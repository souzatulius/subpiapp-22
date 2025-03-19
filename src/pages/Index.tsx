
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import FeatureCard from '@/components/FeatureCard';
import PWAButton from '@/components/PWAButton';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-center">
          <img 
            src="/lovable-uploads/88172eea-6467-4a08-8cf7-3e9c565086dd.png" 
            alt="Logo Prefeitura de São Paulo" 
            className="h-14"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="flex flex-col md:flex-row">
          {/* Left content */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-[#002855]">Demandas da</span><br />
                <span className="text-[#002855]">nossa SUB</span><br />
                <span className="text-[#002855]">com </span>
                <span className="text-[#f57c35]">eficiência</span>
              </h1>
              
              <p className="text-gray-600 text-lg mb-8">
                Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                {user ? (
                  <Link 
                    to="/dashboard" 
                    className="bg-[#002855] text-white px-6 py-3 rounded-md hover:bg-blue-900 transition-all duration-200 flex items-center"
                  >
                    Acessar <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="bg-[#002855] text-white px-6 py-3 rounded-md hover:bg-blue-900 transition-all duration-200 flex items-center"
                    >
                      Acessar <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link 
                      to="/register" 
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-all duration-200"
                    >
                      Solicitar Cadastro
                    </Link>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard type="demandas" />
                <FeatureCard type="acoes" />
                <FeatureCard type="relatorios" />
              </div>
            </div>
          </div>
          
          {/* Right content with blue background */}
          <div className="w-full md:w-1/2 bg-[#002855] flex items-center justify-center p-8 md:p-12 lg:p-16">
            <img 
              src="/lovable-uploads/68db2d5a-d2b5-4bd5-98dd-09f54064eb10.png" 
              alt="Logo SUB PI" 
              className="w-full max-w-md"
            />
          </div>
        </div>
      </main>
      
      {/* PWA Button */}
      <PWAButton />
    </div>
  );
};

export default Index;
