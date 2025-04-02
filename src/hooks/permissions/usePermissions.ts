
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { UsePermissionsReturn } from './types';
import { fetchUserData } from './checkPermissions';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook que verifica permissões de usuário baseado na coordenação
 * Nova implementação simplificada
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Todos os usuários têm acesso total
  const [userCoordination, setUserCoordination] = useState<string | null>(null);
  const [userSupervisaoTecnica, setUserSupervisaoTecnica] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        console.log("Nenhum usuário encontrado, ignorando verificação de permissões");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Iniciando verificação de permissões para o usuário: ${user.id}`);
        
        // Buscar dados do usuário para obter a coordenação
        const { data, error } = await supabase
          .from('usuarios')
          .select('coordenacao_id, supervisao_tecnica_id')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // Armazenar a coordenação e supervisão técnica do usuário
        setUserCoordination(data?.coordenacao_id || null);
        setUserSupervisaoTecnica(data?.supervisao_tecnica_id || null);
        
        // Todos os usuários têm acesso total ao sistema
        setIsAdmin(true);
        
      } catch (err: any) {
        console.error('Erro no processo de verificação de permissão:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Mesmo em caso de erros, conceder privilégios de administrador para garantir o acesso
        setIsAdmin(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user]);
  
  /**
   * Verifica se o usuário pode acessar uma determinada rota com base na coordenação
   */
  const checkRouteAccess = async (route: string): Promise<boolean> => {
    // Se não houver usuário ou coordenação, não permitir acesso
    if (!user || !userCoordination) return false;
    
    try {
      // Verificar se a coordenação do usuário tem permissão para acessar a rota
      const { data, error } = await supabase
        .from('permissoes_acesso')
        .select('*')
        .eq('coordenacao_id', userCoordination)
        .eq('pagina_id', route);
      
      if (error) throw error;
      
      // Se encontrou registros, o usuário tem permissão
      return data && data.length > 0;
      
    } catch (err) {
      console.error('Erro ao verificar acesso à rota:', err);
      return false;
    }
  };

  return { 
    isAdmin, 
    userCoordination, 
    userSupervisaoTecnica, 
    isLoading, 
    error,
    loading: isLoading,
    canAccessProtectedRoute: (route: string) => true // Permitir acesso a todas as rotas
  };
};
