
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { UsePermissionsReturn } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook que verifica permissões de usuário
 * Modificado para permitir acesso total a todas as funcionalidades
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Todos os usuários têm acesso total
  const [userCoordination, setUserCoordination] = useState<string | null>(null);
  const [userSupervisaoTecnica, setUserSupervisaoTecnica] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        console.log("Nenhum usuário encontrado, ignorando verificação de permissões");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Obtendo dados do usuário: ${user.id}`);
        
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
        
        console.log('Permissões do usuário definidas como admin:', true);
      } catch (err: any) {
        console.error('Erro ao buscar dados do usuário:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Mesmo em caso de erros, conceder privilégios de administrador para garantir o acesso
        setIsAdmin(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);
  
  /**
   * Função para verificar acesso a rotas
   * Sempre retorna verdadeiro para permitir acesso a todas as rotas
   */
  const canAccessProtectedRoute = (route: string): boolean => {
    // Retorna sempre true para permitir acesso a qualquer rota
    return true;
  };

  return { 
    isAdmin, 
    userCoordination, 
    userSupervisaoTecnica, 
    isLoading, 
    error,
    loading: isLoading,
    canAccessProtectedRoute
  };
};
