
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserRoles = (fetchData: () => Promise<void>) => {
  const [updating, setUpdating] = useState(false);

  const addRole = async (userId: string, roleId: number, contextData?: { coordenacao_id?: string, supervisao_tecnica_id?: string }) => {
    if (!userId || !roleId) return;
    
    setUpdating(true);
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
      
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao adicionar permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível adicionar a permissão ao usuário.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const removeRole = async (userId: string, roleId: number, contextData?: { coordenacao_id?: string, supervisao_tecnica_id?: string }) => {
    if (!userId || !roleId) return;
    
    setUpdating(true);
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
      
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao remover permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível remover a permissão do usuário.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    addRole,
    removeRole
  };
};
