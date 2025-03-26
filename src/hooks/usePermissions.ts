
import { useEffect, useState } from 'react';
import { useAuth } from './useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UsePermissionsReturn {
  isAdmin: boolean;
  userCoordination: string | null;
  userSupervisaoTecnica: string | null;
  isLoading: boolean;
  error: Error | null;
  loading: boolean; // Add the loading property
  canAccessProtectedRoute: (route: string) => boolean; // Add the function
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

        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('coordenacao_id, supervisao_tecnica_id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        setUserCoordination(userData?.coordenacao_id || null);
        setUserSupervisaoTecnica(userData?.supervisao_tecnica_id || null);

        // Check if user is admin (belongs to Communication or Cabinet)
        if (userData?.coordenacao_id) {
          const { data: coordData, error: coordError } = await supabase
            .from('coordenacoes')
            .select('descricao')
            .eq('id', userData.coordenacao_id)
            .single();

          if (coordError) throw coordError;

          const coordDesc = coordData?.descricao?.toLowerCase() || '';
          const isAdminCoord = 
            coordDesc.includes('comunicação') || 
            coordDesc.includes('comunicacao') || 
            coordDesc.includes('gabinete');
          
          setIsAdmin(isAdminCoord);
        } else {
          setIsAdmin(false);
        }

      } catch (err: any) {
        console.error('Error fetching user permissions:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user]);
  
  // Add canAccessProtectedRoute function
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
    canAccessProtectedRoute // Add the function
  };
};
