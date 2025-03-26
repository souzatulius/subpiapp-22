
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isApproved } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (isApproved === false) {
        // Redirect non-approved users when they try to access protected routes
        navigate('/pending-approval');
      }
    }
  }, [user, isLoading, isApproved, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner animate-spin"></div>
      </div>
    );
  }

  return (user && isApproved) ? <>{children}</> : null;
};

export default ProtectedRoute;
