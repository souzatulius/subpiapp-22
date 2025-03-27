
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { UsePermissionsReturn } from './types';
import { 
  fetchUserData
} from './checkPermissions';
import { canAccessProtectedRoute } from './routePermissions';

/**
 * Hook that checks user permissions and admin status
 * Modified to grant admin access to all authenticated users
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Default to true for all users
  const [userCoordination, setUserCoordination] = useState<string | null>(null);
  const [userSupervisaoTecnica, setUserSupervisaoTecnica] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        console.log("No user found, skipping permission checks");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Starting permission checks for user: ${user.id}`);
        
        // Grant admin privileges to all users
        setIsAdmin(true);
        
        // Still fetch user data for UI consistency
        const { coordenacaoId, supervisaoTecnicaId } = await fetchUserData(user.id);
        setUserCoordination(coordenacaoId);
        setUserSupervisaoTecnica(supervisaoTecnicaId);
        
        console.log(`Final admin status for user ${user.id}: true (forced)`);
      } catch (err: any) {
        console.error('Error in permission check process:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Even in case of errors, grant admin privileges to ensure access
        setIsAdmin(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user]);
  
  /**
   * Wrapper function to check if user can access a protected route
   * Modified to always return true
   */
  const checkRouteAccess = (route: string): boolean => {
    return true; // Allow access to all routes
  };

  return { 
    isAdmin: true, 
    userCoordination, 
    userSupervisaoTecnica, 
    isLoading, 
    error,
    loading: isLoading, // Set loading as alias to isLoading for compatibility
    canAccessProtectedRoute: checkRouteAccess
  };
};
