
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading, isApproved } = useAuth();
  const { isAdmin, loading: permissionLoading, canAccessProtectedRoute } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth and permission checks to complete
      if (authLoading || permissionLoading) return;
      
      // Check if user is logged in and approved
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (isApproved === false) {
        navigate('/pending-approval');
        return;
      }
      
      // Check if user has admin permissions for this route
      if (!isAdmin && !canAccessProtectedRoute(location.pathname)) {
        // Redirect to dashboard or show unauthorized page
        navigate('/dashboard');
      }
    };
    
    checkAccess();
  }, [user, authLoading, isApproved, isAdmin, permissionLoading, canAccessProtectedRoute, navigate, location.pathname]);

  if (authLoading || permissionLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner animate-spin"></div>
      </div>
    );
  }

  // Only render children if user is authenticated, approved and has permission
  return (user && isApproved && (isAdmin || canAccessProtectedRoute(location.pathname))) 
    ? <>{children}</> 
    : null;
};

export default AdminProtectedRoute;
