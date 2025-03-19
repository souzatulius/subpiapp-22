
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import FeatureCard from '@/components/FeatureCard';
import PWAButton from '@/components/PWAButton';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/ae208fd7-3f16-427a-a087-135128e4be50.png" 
              alt="Logo SUB PI" 
              className="h-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="bg-subpi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-all duration-200"
              >
                Acessar Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-subpi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-all duration-200"
                >
                  Acessar
                </Link>
                <Link 
                  to="/register" 
                  className="border border-subpi-orange text-subpi-orange px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  Solicitar Cadastro
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-subpi-blue">Demandas da nossa SUB</span>
                  <br />
                  <span className="text-subpi-orange">com eficiência</span>
                </h1>
                
                <p className="text-subpi-gray-secondary text-lg mb-8">
                  Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {user ? (
                    <Link 
                      to="/dashboard" 
                      className="bg-subpi-blue text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-all duration-200 text-lg font-medium"
                    >
                      Acessar Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="bg-subpi-blue text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-all duration-200 text-lg font-medium"
                      >
                        Acessar
                      </Link>
                      <Link 
                        to="/register" 
                        className="border border-subpi-orange text-subpi-orange px-6 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200 text-lg font-medium"
                      >
                        Solicitar Cadastro
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="/lovable-uploads/68db2d5a-d2b5-4bd5-98dd-09f54064eb10.png" 
                  alt="Logo SUB PI" 
                  className="w-60 md:w-80"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-subpi-blue mb-12 text-center">Funcionalidades Principais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard type="demandas" />
              <FeatureCard type="acoes" />
              <FeatureCard type="relatorios" />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-subpi-blue py-8 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/ae208fd7-3f16-427a-a087-135128e4be50.png" 
                alt="Logo SUB PI" 
                className="h-10"
              />
              <p className="mt-2 text-sm opacity-80">© 2023 Subprefeitura de Pinheiros. Todos os direitos reservados.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <a href="#" className="text-white hover:text-subpi-orange transition-colors">Sobre</a>
              <a href="#" className="text-white hover:text-subpi-orange transition-colors">Contato</a>
              <a href="#" className="text-white hover:text-subpi-orange transition-colors">Termos de Uso</a>
              <a href="#" className="text-white hover:text-subpi-orange transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* PWA Button */}
      <PWAButton />
    </div>
  );
};

export default Index;
