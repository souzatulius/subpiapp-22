
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { useAuth } from "@/hooks/useSupabaseAuth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    // Redirect to dashboard if user is logged in, otherwise to home page
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-poppins">
      <header className="w-full px-6 py-3 border-b border-gray-200 flex justify-center">
        <img 
          src="/lovable-uploads/f0e9c688-4d13-4dee-aa68-f4ac4292ad11.png" 
          alt="Logo SUB-PI" 
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
            onClick={handleGoHome}
            className="bg-subpi-blue text-white py-3 px-6 rounded-lg flex items-center justify-center mx-auto hover:bg-opacity-90 transition-all duration-200"
          >
            <Home className="mr-2 h-5 w-5" /> Voltar para {user ? 'o dashboard' : 'a página inicial'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
