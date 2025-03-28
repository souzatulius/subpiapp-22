
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// This hook handles adding and removing permissions for users
export const usePermissionsManagement = (
  userPermissions: Record<string, string[]>,
  setUserPermissions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  refreshData: () => Promise<void>
) => {
  const [saving, setSaving] = useState(false);

  // Add a permission to a user
  const handleAddPermission = async (
    userId: string,
    permissionId: string,
    isSupervisaoTecnica: boolean
  ) => {
    setSaving(true);
    try {
      // First check if this permission already exists
      const { data, error } = await supabase
        .from('permissoes_acesso')
        .select('*')
        .eq('pagina_id', permissionId)
        .eq(isSupervisaoTecnica ? 'supervisao_tecnica_id' : 'coordenacao_id', userId);

      if (error) throw error;

      // If the permission doesn't exist yet, insert it
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('permissoes_acesso')
          .insert({
            pagina_id: permissionId,
            ...(isSupervisaoTecnica
              ? { supervisao_tecnica_id: userId }
              : { coordenacao_id: userId }),
          });

        if (insertError) throw insertError;
      }

      // Update the local state with the new permission
      setUserPermissions(prev => {
        const updatedPermissions = { ...prev };
        if (!updatedPermissions[userId]) {
          updatedPermissions[userId] = [];
        }
        if (!updatedPermissions[userId].includes(permissionId)) {
          updatedPermissions[userId] = [...updatedPermissions[userId], permissionId];
        }
        return updatedPermissions;
      });

      toast.success('Permissão adicionada com sucesso');
    } catch (error: any) {
      console.error('Error adding permission:', error);
      toast.error(`Erro ao adicionar permissão: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Remove a permission from a user
  const handleRemovePermission = async (
    userId: string,
    permissionId: string,
    isSupervisaoTecnica: boolean
  ) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('permissoes_acesso')
        .delete()
        .eq('pagina_id', permissionId)
        .eq(isSupervisaoTecnica ? 'supervisao_tecnica_id' : 'coordenacao_id', userId);

      if (error) throw error;

      // Update the local state by removing the permission
      setUserPermissions(prev => {
        const updatedPermissions = { ...prev };
        if (updatedPermissions[userId]) {
          updatedPermissions[userId] = updatedPermissions[userId].filter(
            perm => perm !== permissionId
          );
        }
        return updatedPermissions;
      });

      toast.success('Permissão removida com sucesso');
    } catch (error: any) {
      console.error('Error removing permission:', error);
      toast.error(`Erro ao remover permissão: ${error.message}`);
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
