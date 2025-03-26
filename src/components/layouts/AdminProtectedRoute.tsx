
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { usePermissions } from '@/hooks/usePermissions';
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

  useEffect(() => {
    if (authLoading || permissionLoading) return; // garante que só executa com tudo pronto
    
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
    
    if (!isAdmin && !canAccessProtectedRoute(location.pathname)) {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página. Este incidente foi registrado.",
        variant: "destructive"
      });
      
      console.warn("Unauthorized access attempt", {
        userId: user.id,
        email: user.email,
        path: location.pathname,
        timestamp: new Date().toISOString()
      });
      
      navigate('/dashboard');
    }
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

  if (!user || !isApproved || (!isAdmin && !canAccessProtectedRoute(location.pathname))) {
    return null; // ou mostre um fallback amigável
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
