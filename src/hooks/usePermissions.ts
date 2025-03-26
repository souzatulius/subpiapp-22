
import { useEffect, useState } from 'react';
import { useAuth } from './useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UsePermissionsReturn {
  isAdmin: boolean;
  userCoordination: string | null;
  userSupervisaoTecnica: string | null;
  isLoading: boolean;
  error: Error | null;
  loading: boolean;
  canAccessProtectedRoute: (route: string) => boolean;
}

/**
 * Checks if user has a specific role in the database
 */
const checkUserRole = async (userId: string, roleName: string): Promise<boolean> => {
  try {
    console.log(`Checking if user ${userId} has role: ${roleName}`);
    const { data: hasRole, error } = await supabase
      .rpc('user_has_role', {
        _user_id: userId,
        _role_nome: roleName
      });
    
    if (error) {
      console.error(`Error checking if user has role ${roleName}:`, error);
      return false;
    }
    
    console.log(`User ${userId} has role ${roleName}: ${Boolean(hasRole)}`);
    return Boolean(hasRole);
  } catch (err) {
    console.error(`Exception checking if user has role ${roleName}:`, err);
    return false;
  }
};

/**
 * Fetches user's coordination and supervisao tecnica IDs
 */
const fetchUserData = async (userId: string): Promise<{ 
  coordenacaoId: string | null; 
  supervisaoTecnicaId: string | null 
}> => {
  try {
    console.log(`Fetching data for user ${userId}`);
    const { data, error } = await supabase
      .from('usuarios')
      .select('coordenacao_id, supervisao_tecnica_id')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error(`Error fetching user data for ${userId}:`, error);
      return { coordenacaoId: null, supervisaoTecnicaId: null };
    }
    
    console.log(`User data retrieved:`, data);
    return { 
      coordenacaoId: data?.coordenacao_id || null, 
      supervisaoTecnicaId: data?.supervisao_tecnica_id || null 
    };
  } catch (err) {
    console.error(`Exception fetching user data for ${userId}:`, err);
    return { coordenacaoId: null, supervisaoTecnicaId: null };
  }
};

/**
 * Checks if user belongs to a privileged coordination
 */
const checkCoordinationPrivileges = async (coordenacaoId: string): Promise<boolean> => {
  if (!coordenacaoId) return false;
  
  try {
    console.log(`Checking privileges for coordination ${coordenacaoId}`);
    const { data, error } = await supabase
      .from('coordenacoes')
      .select('descricao')
      .eq('id', coordenacaoId)
      .single();
    
    if (error) {
      console.error(`Error fetching coordination data for ${coordenacaoId}:`, error);
      return false;
    }
    
    if (!data?.descricao) {
      console.log(`No description found for coordination ${coordenacaoId}`);
      return false;
    }
    
    // Normalize the coordination description to handle accents and variations
    const normalized = data.descricao
      .normalize("NFD")                
      .replace(/[\u0300-\u036f]/g, "")  
      .toLowerCase()
      .trim();
    
    console.log(`Coordination description: "${data.descricao}"`);
    console.log(`Normalized description: "${normalized}"`);
    
    // Check for privileged coordinations using normalized string
    const isPrivileged = normalized.includes('gabinete') || normalized.includes('comunicacao');
    console.log(`Coordination ${coordenacaoId} is privileged: ${isPrivileged}`);
    
    return isPrivileged;
  } catch (err) {
    console.error(`Exception checking coordination privileges for ${coordenacaoId}:`, err);
    return false;
  }
};

/**
 * Checks if user has legacy admin permissions
 */
const checkLegacyPermissions = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Checking legacy permissions for user ${userId}`);
    const { data: isAdmin, error } = await supabase
      .rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error(`Error checking legacy permissions for ${userId}:`, error);
      return false;
    }
    
    console.log(`User ${userId} has legacy admin permissions: ${Boolean(isAdmin)}`);
    return Boolean(isAdmin);
  } catch (err) {
    console.error(`Exception checking legacy permissions for ${userId}:`, err);
    return false;
  }
};

/**
 * Checks if user is admin by coordination
 */
const checkAdminByCoordination = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Checking admin by coordination for user ${userId}`);
    const { data: isAdmin, error } = await supabase
      .rpc('is_admin_by_coordenacao', { user_id: userId });
    
    if (error) {
      console.error(`Error checking admin by coordination for ${userId}:`, error);
      return false;
    }
    
    console.log(`User ${userId} is admin by coordination: ${Boolean(isAdmin)}`);
    return Boolean(isAdmin);
  } catch (err) {
    console.error(`Exception checking admin by coordination for ${userId}:`, err);
    return false;
  }
};

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
   * Checks if user can access a protected route
   */
  const canAccessProtectedRoute = (route: string): boolean => {
    // Admin can access all routes
    if (isAdmin) {
      console.log(`User has admin status, allowing access to route: ${route}`);
      return true;
    }
    
    // Protected routes that only admins can access
    const adminOnlyRoutes = [
      '/settings',
      '/dashboard/comunicacao/cadastrar-demanda',
      '/dashboard/comunicacao/consultar-demandas',
      '/dashboard/comunicacao/criar-nota-oficial',
      '/dashboard/comunicacao/consultar-notas',
      '/cadastrar-demanda',
      '/consultar-demandas',
      '/criar-nota-oficial',
      '/consultar-notas'
    ];
    
    // Check if the route starts with any of the admin-only routes
    const isAdminRoute = adminOnlyRoutes.some(adminRoute => 
      route === adminRoute || 
      route.startsWith(`${adminRoute}/`)
    );
    
    const canAccess = !isAdminRoute;
    console.log(`Route "${route}" is ${isAdminRoute ? 'admin-only' : 'accessible to all'}, access granted: ${canAccess}`);
    return canAccess;
  };

  return { 
    isAdmin, 
    userCoordination, 
    userSupervisaoTecnica, 
    isLoading, 
    error,
    loading: isLoading, // Set loading as alias to isLoading for compatibility
    canAccessProtectedRoute
  };
};
