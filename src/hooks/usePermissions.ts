
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/components/settings/access-control/hooks/useCurrentUser';

export const usePermissions = () => {
  const { currentUserId } = useCurrentUser();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userCoordination, setUserCoordination] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if user is admin based on coordenacao_id
        const { data: adminStatus, error: adminError } = await supabase
          .rpc('is_admin_by_coordenacao', { user_id: currentUserId });
          
        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!adminStatus);
        }
        
        // Get user's coordination
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', currentUserId)
          .single();
          
        if (userError) {
          console.error('Error fetching user coordination:', userError);
        } else if (userData) {
          setUserCoordination(userData.coordenacao_id);
        }
      } catch (error) {
        console.error('Error in permission check:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [currentUserId]);

  const canAccessDemanda = async (demandaId: string): Promise<boolean> => {
    if (isAdmin) return true;
    if (!currentUserId || !demandaId) return false;
    
    try {
      const { data, error } = await supabase
        .rpc('user_belongs_to_demanda_coordenacao', {
          user_id: currentUserId,
          demanda_id: demandaId
        });
        
      if (error) {
        console.error('Error checking demanda access:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in demanda access check:', error);
      return false;
    }
  };

  const canAccessProtectedRoute = (route: string): boolean => {
    if (isAdmin) return true;
    
    const protectedRoutes = [
      '/settings',
      '/cadastrar-demanda',
      '/consultar-demandas',
      '/criar-nota-oficial',
      '/consultar-notas',
      '/dashboard/comunicacao/consultar-demandas',
      '/dashboard/comunicacao/cadastrar-demanda',
      '/notas-oficiais'
    ];
    
    // Check if the current route is protected
    return !protectedRoutes.some(protectedRoute => 
      route === protectedRoute || route.startsWith(`${protectedRoute}/`)
    );
  };

  return {
    isAdmin,
    userCoordination,
    loading,
    canAccessDemanda,
    canAccessProtectedRoute
  };
};
