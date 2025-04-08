
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeatureCard from '@/components/FeatureCard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import fitty from 'fitty';

const LeftContentSection: React.FC = () => {
  const {
    user
  } = useAuth();
  const location = useLocation();
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);

  // Check if the current page is login or register
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  
  useEffect(() => {
    // Initialize fitty on both title lines
    if (titleLine1Ref.current && titleLine2Ref.current) {
      const fittyInstance1 = fitty(titleLine1Ref.current, {
        minSize: 24,
        maxSize: 90,
        multiLine: false
      });
      
      const fittyInstance2 = fitty(titleLine2Ref.current, {
        minSize: 24,
        maxSize: 90,
        multiLine: false
      });
      
      // Clean up on unmount
      return () => {
        fittyInstance1.unsubscribe();
        fittyInstance2.unsubscribe();
      };
    }
  }, []);
  
  return (
    <div className="max-w-2xl mx-auto md:mx-0">
      <h1 className="font-bold mb-6 overflow-hidden">
        <div ref={titleLine1Ref} className="text-[#002855] bg-transparent whitespace-nowrap w-full">Demandas com mais</div>
        <div ref={titleLine2Ref} className="text-[#f57c35] whitespace-nowrap w-full">eficiência</div>
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
            <Button asChild className={`rounded-xl py-2 px-6 flex items-center shadow-md transition-all duration-300 ${isLoginPage ? "bg-gray-400 text-gray-100 cursor-not-allowed hover:bg-gray-400 hover:shadow-md" : "bg-[#002855] hover:bg-[#001f40] text-white hover:shadow-lg"}`} disabled={isLoginPage}>
              <Link to={isLoginPage ? "#" : "/login"} className="h-12 text-lg">
                Acessar <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className={`rounded-xl bg-transparent border-2 py-2 px-6 shadow-md transition-all duration-300 ${isRegisterPage ? "border-gray-400 text-gray-400 cursor-not-allowed hover:border-gray-400 hover:bg-transparent hover:text-gray-400 hover:shadow-md" : "border-[#f57c35] text-[#f57c35] hover:bg-[#f57c35] hover:text-white hover:shadow-lg"}`} disabled={isRegisterPage}>
              <Link to={isRegisterPage ? "#" : "/register"} className="h-12 text-lg">
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
  );
};

export default LeftContentSection;
