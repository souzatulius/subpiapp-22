
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import FeatureCard from '@/components/FeatureCard';
import PWAButton from '@/components/PWAButton';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layouts/Header';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - explicitly pass showControls={false} */}
      <Header showControls={false} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Content */}
        <div className="w-full md:w-2/3 px-6 md:px-16 lg:px-20 py-12 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto md:mx-0 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-[#002855]">Demandas da SUB com </span>
              <span className="text-[#f57c35]">eficiência</span>
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-xl">
              Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12 transition-all duration-300">
              {user ? (
                <Button asChild className="rounded-xl bg-[#002855] hover:bg-[#001f40] text-white py-2 px-6 flex items-center shadow-md hover:shadow-lg transition-all duration-300">
                  <Link to="/dashboard">
                    Acessar <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="rounded-xl bg-[#002855] hover:bg-[#001f40] text-white py-2 px-6 flex items-center shadow-md hover:shadow-lg transition-all duration-300">
                    <Link to="/login">
                      Acessar <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl bg-transparent text-[#f57c35] border-2 border-[#f57c35] hover:bg-[#f57c35] hover:text-white py-2 px-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <Link to="/register">
                      Solicitar Acesso
                    </Link>
                  </Button>
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
        
        {/* Right side with blue background */}
        <div className="w-full md:w-1/3 bg-[#003570] flex flex-col items-center justify-center p-8 relative">
          <img src="/lovable-uploads/292774a8-b25d-4dc6-9555-f54295b8bd9f.png" alt="Logo SUB PI" className="w-4/5 max-w-sm mb-8" />
          <h2 className="text-white text-4xl font-bold">
            SUB<span className="bg-[#f57c35] px-2 py-1 rounded ml-1">PI</span>
          </h2>
        </div>
      </div>
      
      {/* PWA Button */}
      <PWAButton />
    </div>
  );
};

export default Index;
