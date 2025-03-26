
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

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userCoordination, setUserCoordination] = useState<string | null>(null);
  const [userSupervisaoTecnica, setUserSupervisaoTecnica] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Check if user has admin role using the RPC function
        const { data: isUserAdmin, error: adminCheckError } = await supabase
          .rpc('user_has_role', {
            _user_id: user.id,
            _role_nome: 'admin'
          });

        if (adminCheckError) throw adminCheckError;
        
        let adminStatus = !!isUserAdmin;

        // Fetch user data for coordination and supervisao tecnica
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('coordenacao_id, supervisao_tecnica_id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        setUserCoordination(userData?.coordenacao_id || null);
        setUserSupervisaoTecnica(userData?.supervisao_tecnica_id || null);

        // If user belongs to Gabinete or Comunicação coordination, grant admin access
        if (userData?.coordenacao_id) {
          const { data: coordData, error: coordError } = await supabase
            .from('coordenacoes')
            .select('descricao')
            .eq('id', userData.coordenacao_id)
            .single();
            
          if (!coordError && coordData) {
            const coordDescription = coordData.descricao.toLowerCase();
            if (coordDescription.includes('gabinete') || coordDescription.includes('comunicação') || coordDescription.includes('comunicacao')) {
              adminStatus = true;
            }
          }
        }

        // If not admin by role or coordination, check by legacy permissions
        if (!adminStatus) {
          const { data: isAdminByPermission, error: permissionError } = await supabase
            .rpc('is_admin', { user_id: user.id });
            
          if (!permissionError && isAdminByPermission) {
            adminStatus = true;
          }
        }

        // Also check if admin by coordination (fallback method)
        if (!adminStatus) {
          const { data: isAdminByCoord, error: coordError } = await supabase
            .rpc('is_admin_by_coordenacao', { user_id: user.id });
            
          if (!coordError && isAdminByCoord) {
            adminStatus = true;
          }
        }

        setIsAdmin(adminStatus);
      } catch (err: any) {
        console.error('Error fetching user permissions:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user]);
  
  // Function to check if user can access a protected route
  const canAccessProtectedRoute = (route: string): boolean => {
    // Admin can access all routes
    if (isAdmin) return true;
    
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
    return !adminOnlyRoutes.some(adminRoute => 
      route === adminRoute || 
      route.startsWith(`${adminRoute}/`)
    );
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
