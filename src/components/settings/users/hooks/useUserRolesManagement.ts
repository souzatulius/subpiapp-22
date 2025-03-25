
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserRolesManagement = () => {
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
  const [userForRoles, setUserForRoles] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const openRolesDialog = (user: any) => {
    setUserForRoles(user);
    setIsRolesDialogOpen(true);
  };

  const closeRolesDialog = () => {
    setIsRolesDialogOpen(false);
    setUserForRoles(null);
  };

  const addRoleToUser = async (userId: string, roleId: number, contextData?: { coordenacao_id?: string, supervisao_tecnica_id?: string }) => {
    if (!userId || !roleId) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('usuario_roles')
        .insert({
          usuario_id: userId,
          role_id: roleId,
          coordenacao_id: contextData?.coordenacao_id || null,
          supervisao_tecnica_id: contextData?.supervisao_tecnica_id || null
        });
      
      if (error) throw error;
      
      toast({
        title: 'Permissão adicionada',
        description: 'Permissão adicionada com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível adicionar a permissão ao usuário.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeRoleFromUser = async (userId: string, roleId: number, contextData?: { coordenacao_id?: string, supervisao_tecnica_id?: string }) => {
    if (!userId || !roleId) return false;
    
    setLoading(true);
    try {
      const query = supabase
        .from('usuario_roles')
        .delete()
        .eq('usuario_id', userId)
        .eq('role_id', roleId);
      
      // Add context filters if provided
      if (contextData?.coordenacao_id) {
        query.eq('coordenacao_id', contextData.coordenacao_id);
      } else {
        query.is('coordenacao_id', null);
      }
      
      if (contextData?.supervisao_tecnica_id) {
        query.eq('supervisao_tecnica_id', contextData.supervisao_tecnica_id);
      } else {
        query.is('supervisao_tecnica_id', null);
      }
      
      const { error } = await query;
      
      if (error) throw error;
      
      toast({
        title: 'Permissão removida',
        description: 'Permissão removida com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao remover permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível remover a permissão do usuário.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isRolesDialogOpen,
    userForRoles,
    loading,
    openRolesDialog,
    closeRolesDialog,
    addRoleToUser,
    removeRoleFromUser
  };
};
