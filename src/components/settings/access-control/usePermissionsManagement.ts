
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
    if (!userId || !permissionId) {
      console.error("ID do usuário ou permissão inválidos");
      toast({
        title: 'Erro',
        description: 'Dados inválidos para adicionar permissão',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Verificar se a permissão já existe para evitar duplicação
      const { data: existingPermission, error: checkError } = await supabase
        .from('usuario_permissoes')
        .select('*')
        .eq('usuario_id', userId)
        .eq('permissao_id', permissionId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = not found, que é o esperado
        console.error('Erro ao verificar permissão existente:', checkError);
        throw checkError;
      }
      
      // Se a permissão já existe, retornar sem fazer nada
      if (existingPermission) {
        toast({
          title: 'Informação',
          description: 'O usuário já possui esta permissão',
        });
        return;
      }
      
      // Inserir a permissão
      const { data, error } = await supabase
        .from('usuario_permissoes')
        .insert({
          usuario_id: userId,
          permissao_id: permissionId
        })
        .select();
        
      if (error) {
        console.error('Erro detalhado ao adicionar permissão:', error);
        throw error;
      }
      
      // Update local state
      setUserPermissions(prev => {
        const updated = { ...prev };
        if (!updated[userId]) {
          updated[userId] = [];
        }
        updated[userId] = [...updated[userId], permissionId];
        return updated;
      });
      
      toast({
        title: 'Sucesso',
        description: 'Permissão adicionada com sucesso',
      });
      
      // Fetch fresh data to ensure we have the latest state
      await fetchData();
      
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
    if (!userId || !permissionId) {
      console.error("ID do usuário ou permissão inválidos");
      toast({
        title: 'Erro',
        description: 'Dados inválidos para remover permissão',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('usuario_permissoes')
        .delete()
        .eq('usuario_id', userId)
        .eq('permissao_id', permissionId);
        
      if (error) {
        console.error('Erro detalhado ao remover permissão:', error);
        throw error;
      }
      
      // Update local state
      setUserPermissions(prev => {
        const updated = { ...prev };
        if (updated[userId]) {
          updated[userId] = updated[userId].filter(id => id !== permissionId);
        }
        return updated;
      });
      
      toast({
        title: 'Sucesso',
        description: 'Permissão removida com sucesso',
      });
      
      // Fetch fresh data to ensure we have the latest state
      await fetchData();
      
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
