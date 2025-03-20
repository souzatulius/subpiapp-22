
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { UserPermissionMapping } from './types';

export const usePermissionsManagement = (
  userPermissions: UserPermissionMapping,
  setUserPermissions: React.Dispatch<React.SetStateAction<UserPermissionMapping>>,
  refreshData?: () => Promise<void>
) => {
  const [saving, setSaving] = useState(false);

  const handleAddPermission = async (userId: string, permissionId: string) => {
    if (!permissionId) return;
    
    setSaving(true);
    
    try {
      // Check if permission already exists to avoid duplicate
      const userPerms = userPermissions[userId] || [];
      if (userPerms.includes(permissionId)) {
        toast({
          title: 'Aviso',
          description: 'Esta permissão já foi atribuída ao usuário.',
        });
        setSaving(false);
        return;
      }
      
      // Add permission
      const { error } = await supabase
        .from('usuario_permissoes')
        .insert({
          usuario_id: userId,
          permissao_id: permissionId,
        });
        
      if (error) throw error;
      
      // Update local state
      setUserPermissions(prev => ({
        ...prev,
        [userId]: [...(prev[userId] || []), permissionId],
      }));
      
      toast({
        title: 'Permissão adicionada',
        description: 'A permissão foi adicionada com sucesso',
      });
      
      // Refresh data if function is provided
      if (refreshData) {
        await refreshData();
      }
    } catch (error: any) {
      console.error('Erro ao adicionar permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar a permissão.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePermission = async (userId: string, permissionId: string) => {
    setSaving(true);
    
    try {
      // Remove permission
      const { error } = await supabase
        .from('usuario_permissoes')
        .delete()
        .match({
          usuario_id: userId,
          permissao_id: permissionId,
        });
        
      if (error) throw error;
      
      // Update local state
      setUserPermissions(prev => ({
        ...prev,
        [userId]: (prev[userId] || []).filter(id => id !== permissionId),
      }));
      
      toast({
        title: 'Permissão removida',
        description: 'A permissão foi removida com sucesso',
      });
      
      // Refresh data if function is provided
      if (refreshData) {
        await refreshData();
      }
    } catch (error: any) {
      console.error('Erro ao remover permissão:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao remover a permissão.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    handleAddPermission,
    handleRemovePermission
  };
};
