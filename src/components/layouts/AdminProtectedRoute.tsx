
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
    const checkAccess = async () => {
      // Wait for auth and permission checks to complete
      if (authLoading || permissionLoading) return;
      
      console.log("Checking access to admin route:", location.pathname);
      console.log("User auth state:", { 
        user: !!user, 
        isApproved, 
        isAdmin, 
        email: user?.email,
        path: location.pathname
      });
      
      // Check if user is logged in and approved
      if (!user) {
        console.log("User not logged in, redirecting to login");
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      if (isApproved === false) {
        console.log("User not approved, redirecting to pending approval");
        toast({
          title: "Conta não aprovada",
          description: "Sua conta ainda está aguardando aprovação.",
          variant: "destructive"
        });
        navigate('/pending-approval');
        return;
      }
      
      // Check if user has admin permissions for this route
      if (!isAdmin && !canAccessProtectedRoute(location.pathname)) {
        console.log("User does not have admin permissions, redirecting to dashboard");
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar esta página. Este incidente foi registrado.",
          variant: "destructive"
        });
        
        // Log access attempt for security auditing
        console.warn("Unauthorized access attempt", {
          userId: user.id,
          email: user.email,
          path: location.pathname,
          timestamp: new Date().toISOString()
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    };
    
    try {
      checkAccess();
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast({
        title: "Erro de verificação",
        description: "Ocorreu um erro ao verificar suas permissões. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [user, authLoading, isApproved, isAdmin, permissionLoading, canAccessProtectedRoute, navigate, location.pathname]);

  if (authLoading || permissionLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  // Show error state if there are permission problems but user is logged in
  if (user && !isAdmin && !canAccessProtectedRoute(location.pathname)) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Você não tem permissão para acessar esta página. 
            Entre em contato com um administrador caso acredite que isso seja um erro.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Only render children if user is authenticated, approved and has permission
  return (user && isApproved && (isAdmin || canAccessProtectedRoute(location.pathname))) 
    ? <>{children}</> 
    : null;
};

export default AdminProtectedRoute;
