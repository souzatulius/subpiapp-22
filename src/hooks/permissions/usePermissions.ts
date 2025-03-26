
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { UsePermissionsReturn } from './types';
import { 
  checkUserRole, 
  fetchUserData, 
  checkCoordinationPrivileges, 
  checkLegacyPermissions, 
  checkAdminByCoordination 
} from './checkPermissions';
import { canAccessProtectedRoute } from './routePermissions';

/**
 * Hook that checks user permissions and admin status
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
        let adminStatus = false;

        // 1. Check if user has admin role
        const hasAdminRole = await checkUserRole(user.id, 'admin');
        if (hasAdminRole) {
          console.log("User granted admin status via admin role");
          adminStatus = true;
          // We don't return early to ensure we fetch coordination data for other features
        }

        // 2. Fetch user coordination and supervisao data
        const { coordenacaoId, supervisaoTecnicaId } = await fetchUserData(user.id);
        setUserCoordination(coordenacaoId);
        setUserSupervisaoTecnica(supervisaoTecnicaId);

        // 3. Check if user belongs to privileged coordination
        if (coordenacaoId && !adminStatus) {
          const hasCoordinationPrivileges = await checkCoordinationPrivileges(coordenacaoId);
          if (hasCoordinationPrivileges) {
            console.log("User granted admin status via privileged coordination");
            adminStatus = true;
          }
        }

        // 4. Check legacy permissions if not admin yet
        if (!adminStatus) {
          const hasLegacyPermissions = await checkLegacyPermissions(user.id);
          if (hasLegacyPermissions) {
            console.log("User granted admin status via legacy permissions");
            adminStatus = true;
          }
        }

        // 5. Final fallback - check admin by coordination
        if (!adminStatus) {
          const isAdminByCoord = await checkAdminByCoordination(user.id);
          if (isAdminByCoord) {
            console.log("User granted admin status via admin_by_coordenacao function");
            adminStatus = true;
          }
        }

        console.log(`Final admin status for user ${user.id}: ${adminStatus}`);
        setIsAdmin(adminStatus);
      } catch (err: any) {
        console.error('Error in permission check process:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user]);
  
  /**
   * Wrapper function to check if user can access a protected route
   */
  const checkRouteAccess = (route: string): boolean => {
    return canAccessProtectedRoute(route, isAdmin);
  };

  return { 
    isAdmin, 
    userCoordination, 
    userSupervisaoTecnica, 
    isLoading, 
    error,
    loading: isLoading, // Set loading as alias to isLoading for compatibility
    canAccessProtectedRoute: checkRouteAccess
  };
};
