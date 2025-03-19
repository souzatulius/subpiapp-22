import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import FeatureCard from '@/components/FeatureCard';
import PWAButton from '@/components/PWAButton';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layouts/Header';
const Index = () => {
  const {
    user
  } = useAuth();
  return <div className="min-h-screen flex flex-col">
      {/* Header - explicitly pass showControls={false} */}
      <Header showControls={false} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center px-[25px] py-[30px]">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-tight mb-6 px-0 text-left md:text-8xl">
              <span className="text-[#002855]">Demandas </span><br />
              <span className="text-[#002855]">da SUB com</span><br />
              
              <span className="text-[#f57c35]">eficiência</span>
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 text-left">
              Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12 px-0 mx-0">
              {user ? <Button asChild className="rounded-full bg-[#002855] hover:bg-[#001f40] text-white py-2 px-5 flex items-center">
                  <Link to="/dashboard" className="px-[40px]">
                    Acessar <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button> : <>
                  <Button asChild className="rounded-full bg-[#002855] hover:bg-[#001f40] text-white py-2 px-5 flex items-center">
                    <Link to="/login" className="px-[46px]">
                      Acessar <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full bg-transparent text-[#f57c35] border border-[#f57c35] hover:bg-gray-50 py-2 px-5">
                    <Link to="/register" className="px-[41px]">
                      Solicitar Acesso
                    </Link>
                  </Button>
                </>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard type="demandas" />
              <FeatureCard type="acoes" />
              <FeatureCard type="relatorios" />
            </div>
          </div>
        </div>
        
        {/* Right side with blue background */}
        <div className="w-full md:w-1/2 bg-[#003570] flex items-center justify-center p-8 md:p-12 px-0 py-[30px]">
          <img src="/lovable-uploads/292774a8-b25d-4dc6-9555-f54295b8bd9f.png" alt="Logo SUB PI" className="w-full max-w-md" />
        </div>
      </div>
      
      {/* PWA Button */}
      <PWAButton />
    </div>;
};
export default Index;