
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-poppins">
      <header className="w-full px-6 py-3 border-b border-gray-200 flex justify-center">
        <img 
          src="/lovable-uploads/68db2d5a-d2b5-4bd5-98dd-09f54064eb10.png" 
          alt="Logo Prefeitura de São Paulo" 
          className="h-10"
        />
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-subpi-blue mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-subpi-gray-text mb-4">Página não encontrada</h2>
          <p className="text-subpi-gray-secondary mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-subpi-blue text-white py-3 px-6 rounded-lg flex items-center justify-center mx-auto hover:bg-opacity-90 transition-all duration-200"
          >
            <Home className="mr-2 h-5 w-5" /> Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
