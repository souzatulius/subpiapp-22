
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { usePermissions } from '@/hooks/permissions';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoading: authLoading, isApproved } = useAuth();
  const { isAdmin, isLoading: permissionLoading, canAccessProtectedRoute } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (authLoading || permissionLoading) return; // Don't proceed until both auth and permissions are loaded
    
    console.log("Checking access to admin route:", location.pathname);
    console.log("User auth state:", { 
      user: !!user, 
      isApproved, 
      isAdmin, 
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
    
    if (isApproved === false) {
      toast({
        title: "Conta não aprovada",
        description: "Sua conta ainda está aguardando aprovação.",
        variant: "destructive"
      });
      navigate('/pending-approval');
      return;
    }
    
    // Removendo verificação de admin para a página de Settings
    // Todos os usuários autenticados e aprovados poderão acessar
    setAccessChecked(true);
  }, [
    user,
    authLoading,
    isApproved,
    isAdmin,
    permissionLoading,
    canAccessProtectedRoute,
    navigate,
    location.pathname,
  ]);

  if (authLoading || permissionLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (!user || !isApproved) {
    return null; // Não renderiza nada enquanto aguarda o redirecionamento
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
