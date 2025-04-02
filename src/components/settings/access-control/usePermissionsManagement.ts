
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Este hook gerencia a adição e remoção de permissões para coordenações
export const usePermissionsManagement = (
  coordinationPermissions: Record<string, string[]>,
  setCoordinationPermissions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  refreshData: () => Promise<void>
) => {
  const [saving, setSaving] = useState(false);

  // Adicionar uma permissão a uma coordenação
  const handleAddPermission = async (
    coordenacaoId: string,
    permissionId: string
  ) => {
    setSaving(true);
    try {
      // Primeiro verificar se a permissão já existe
      const { data, error } = await supabase
        .from('permissoes_acesso')
        .select('*')
        .eq('pagina_id', permissionId)
        .eq('coordenacao_id', coordenacaoId);

      if (error) throw error;

      // Se a permissão não existe, inserir
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('permissoes_acesso')
          .insert({
            pagina_id: permissionId,
            coordenacao_id: coordenacaoId
          });

        if (insertError) throw insertError;
      }

      // Atualizar o estado local com a nova permissão
      setCoordinationPermissions(prev => {
        const updatedPermissions = { ...prev };
        if (!updatedPermissions[coordenacaoId]) {
          updatedPermissions[coordenacaoId] = [];
        }
        if (!updatedPermissions[coordenacaoId].includes(permissionId)) {
          updatedPermissions[coordenacaoId] = [...updatedPermissions[coordenacaoId], permissionId];
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

  // Remover uma permissão de uma coordenação
  const handleRemovePermission = async (
    coordenacaoId: string,
    permissionId: string
  ) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('permissoes_acesso')
        .delete()
        .eq('pagina_id', permissionId)
        .eq('coordenacao_id', coordenacaoId);

      if (error) throw error;

      // Atualizar o estado local removendo a permissão
      setCoordinationPermissions(prev => {
        const updatedPermissions = { ...prev };
        if (updatedPermissions[coordenacaoId]) {
          updatedPermissions[coordenacaoId] = updatedPermissions[coordenacaoId].filter(
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
