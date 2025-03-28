
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePermissionsManagement = (
  userPermissions: Record<string, string[]>,
  setUserPermissions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  refreshData: () => Promise<void>
) => {
  const [saving, setSaving] = useState(false);

  const handleAddPermission = async (userId: string, permissionId: string) => {
    setSaving(true);
    try {
      console.log(`Adding permission ${permissionId} to user ${userId}`);
      
      // Determine if it's a coordenação or supervisão técnica
      const isCoordination = userId.startsWith('coord_');
      
      const { error } = await supabase
        .from('permissoes_acesso')
        .insert({
          coordenacao_id: isCoordination ? userId : null,
          supervisao_tecnica_id: !isCoordination ? userId : null,
          pagina_id: permissionId
        });
      
      if (error) {
        // If the table doesn't exist, we'll create it
        if (error.code === 'PGRST116') {
          const { error: createError } = await supabase.rpc(
            'create_permissions_table'
          );
          
          if (createError) throw createError;
          
          // Try inserting again
          const { error: insertError } = await supabase
            .from('permissoes_acesso')
            .insert({
              coordenacao_id: isCoordination ? userId : null,
              supervisao_tecnica_id: !isCoordination ? userId : null,
              pagina_id: permissionId
            });
            
          if (insertError) throw insertError;
        } else {
          throw error;
        }
      }
      
      // Update local state
      setUserPermissions(prev => {
        const updated = { ...prev };
        if (!updated[userId]) {
          updated[userId] = [];
        }
        
        if (!updated[userId].includes(permissionId)) {
          updated[userId].push(permissionId);
        }
        
        return updated;
      });
      
      toast.success('Permissão adicionada com sucesso');
    } catch (error: any) {
      console.error('Error adding permission:', error);
      toast.error(`Erro ao adicionar permissão: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePermission = async (userId: string, permissionId: string) => {
    setSaving(true);
    try {
      console.log(`Removing permission ${permissionId} from user ${userId}`);
      
      // Determine if it's a coordenação or supervisão técnica
      const isCoordination = userId.startsWith('coord_');
      
      const { error } = await supabase
        .from('permissoes_acesso')
        .delete()
        .match({
          coordenacao_id: isCoordination ? userId : null,
          supervisao_tecnica_id: !isCoordination ? userId : null,
          pagina_id: permissionId
        });
      
      if (error) throw error;
      
      // Update local state
      setUserPermissions(prev => {
        const updated = { ...prev };
        if (updated[userId]) {
          updated[userId] = updated[userId].filter(id => id !== permissionId);
        }
        return updated;
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
