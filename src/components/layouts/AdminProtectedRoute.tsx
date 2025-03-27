
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Don't proceed until auth is loaded
    
    console.log("Checking access to admin route:", location.pathname);
    console.log("User auth state:", { 
      user: !!user, 
      email: user?.email,
      path: location.pathname
    });
    
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Permitindo acesso a todos os usuários autenticados
    setAccessChecked(true);
  }, [
    user,
    authLoading,
    navigate,
    location.pathname,
  ]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Não renderiza nada enquanto aguarda o redirecionamento
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
