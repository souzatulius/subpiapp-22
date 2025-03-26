
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
      setIsLoading(true);
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Checking permissions for user:", user.id);
        
        let adminStatus = false;

        // 1. Verifica se o usuário tem role 'admin'
        try {
          const { data: isUserAdmin, error: adminCheckError } = await supabase
            .rpc('user_has_role', {
              _user_id: user.id,
              _role_nome: 'admin'
            });

          if (adminCheckError) {
            console.error("Error in user_has_role check:", adminCheckError);
          } else if (isUserAdmin === true) {
            console.log("User has admin role");
            adminStatus = true;
          }
        } catch (roleError) {
          console.error("Exception in user_has_role RPC:", roleError);
        }

        // 2. Fetch user data for coordination and supervisao tecnica
        try {
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('coordenacao_id, supervisao_tecnica_id')
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
          } else if (userData) {
            console.log("User data:", userData);
            setUserCoordination(userData?.coordenacao_id || null);
            setUserSupervisaoTecnica(userData?.supervisao_tecnica_id || null);

            // 3. Check if user belongs to privileged coordination (Gabinete or Comunicação)
            if (userData.coordenacao_id && !adminStatus) {
              try {
                const { data: coordData, error: coordError } = await supabase
                  .from('coordenacoes')
                  .select('descricao')
                  .eq('id', userData.coordenacao_id)
                  .single();
                  
                if (coordError) {
                  console.error("Error fetching coordination data:", coordError);
                } else if (coordData?.descricao) {
                  // Normalize the coordination description to handle accents and variations
                  const normalized = coordData.descricao
                    .normalize("NFD")                // separates letters and accents
                    .replace(/[\u0300-\u036f]/g, "")  // removes accents
                    .toLowerCase()
                    .trim();
                  
                  console.log("Coordination description:", coordData.descricao);
                  console.log("Normalized description:", normalized);
                  
                  // Check for privileged coordinations using normalized string
                  if (normalized.includes('gabinete') || normalized.includes('comunicacao')) {
                    console.log("User belongs to privileged coordination, granting admin access");
                    adminStatus = true;
                  }
                }
              } catch (coordCheckError) {
                console.error("Exception checking coordination:", coordCheckError);
              }
            }
          }
        } catch (userDataError) {
          console.error("Exception fetching user data:", userDataError);
        }

        // 4. If not admin by role or coordination, check by legacy permissions
        if (!adminStatus) {
          try {
            const { data: isAdminByPermission, error: permissionError } = await supabase
              .rpc('is_admin', { user_id: user.id });
              
            if (permissionError) {
              console.error("Error checking is_admin RPC:", permissionError);
            } else if (isAdminByPermission === true) {
              console.log("User is admin by legacy permission");
              adminStatus = true;
            }
          } catch (permissionError) {
            console.error("Exception in is_admin RPC:", permissionError);
          }
        }

        // 5. Also check if admin by coordination (fallback method)
        if (!adminStatus) {
          try {
            const { data: isAdminByCoord, error: coordError } = await supabase
              .rpc('is_admin_by_coordenacao', { user_id: user.id });
              
            if (coordError) {
              console.error("Error checking is_admin_by_coordenacao RPC:", coordError);
            } else if (isAdminByCoord === true) {
              console.log("User is admin by coordination (via RPC function)");
              adminStatus = true;
            }
          } catch (coordError) {
            console.error("Exception in is_admin_by_coordenacao RPC:", coordError);
          }
        }

        console.log("Final admin status:", adminStatus);
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
    if (isAdmin) {
      console.log("User is admin, allowing access to route:", route);
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
    
    console.log(`Route ${route} is ${isAdminRoute ? 'admin-only' : 'accessible to all'}`);
    return !isAdminRoute;
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
