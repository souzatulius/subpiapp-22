
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { UserPermissionMapping } from './types';

export const usePermissionsManagement = (
  userPermissions: UserPermissionMapping,
  setUserPermissions: React.Dispatch<React.SetStateAction<UserPermissionMapping>>,
  fetchData: () => Promise<void>
) => {
  const [saving, setSaving] = useState(false);

  const handleAddPermission = async (userId: string, permissionId: string) => {
    console.log(`Adding permission ${permissionId} to user ${userId}`);
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('usuario_permissoes')
        .insert({
          usuario_id: userId,
          permissao_id: permissionId
        });
        
      if (error) throw error;
      
      // Update local state
      setUserPermissions(prev => {
        const updated = { ...prev };
        if (!updated[userId]) {
          updated[userId] = [];
        }
        updated[userId] = [...updated[userId], permissionId];
        return updated;
      });
      
      console.log(`Permission ${permissionId} added successfully to user ${userId}`);
      
      // Fetch fresh data to ensure we have the latest state
      await fetchData();
      
      toast({
        title: 'Sucesso',
        description: 'Permissão adicionada com sucesso',
      });
      
    } catch (error: any) {
      console.error('Erro ao adicionar permissão:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível adicionar a permissão: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePermission = async (userId: string, permissionId: string) => {
    console.log(`Removing permission ${permissionId} from user ${userId}`);
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('usuario_permissoes')
        .delete()
        .eq('usuario_id', userId)
        .eq('permissao_id', permissionId);
        
      if (error) throw error;
      
      // Update local state
      setUserPermissions(prev => {
        const updated = { ...prev };
        if (updated[userId]) {
          updated[userId] = updated[userId].filter(id => id !== permissionId);
        }
        return updated;
      });
      
      console.log(`Permission ${permissionId} removed successfully from user ${userId}`);
      
      // Fetch fresh data to ensure we have the latest state
      await fetchData();
      
      toast({
        title: 'Sucesso',
        description: 'Permissão removida com sucesso',
      });
      
    } catch (error: any) {
      console.error('Erro ao remover permissão:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível remover a permissão: ${error.message}`,
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
