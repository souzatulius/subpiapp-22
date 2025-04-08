
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useUserApproval = (refreshUsers: () => Promise<void>) => {
  const [approving, setApproving] = useState(false);

  const approveUser = async (userId: string, userName: string, userEmail: string, roleName?: string) => {
    setApproving(true);
    
    try {
      console.log(`Aprovando usuário: ${userName}, ID: ${userId}`);
      
      // Update user status in the 'usuarios' table (not 'users')
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ status: 'ativo' })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      // Add default permission if role name is not provided
      if (!roleName) {
        roleName = 'padrão';
      }
      
      // Get the permission ID for the given role name
      const { data: permissionData, error: permissionError } = await supabase
        .from('permissoes')
        .select('id')
        .eq('descricao', roleName)
        .single();
      
      if (permissionError) throw permissionError;
      
      if (!permissionData?.id) {
        throw new Error(`Permissão para papel '${roleName}' não encontrada`);
      }
      
      // Create a user permission with the selected role
      const { error: permissionAssignError } = await supabase
        .from('usuario_permissoes')
        .insert({
          usuario_id: userId,
          permissao_id: permissionData.id
        });
      
      if (permissionAssignError) throw permissionAssignError;
      
      // Successfully updated user status and assigned permission
      toast({
        title: "Usuário aprovado",
        description: `${userName} (${userEmail}) agora tem acesso ao sistema.`
      });
      
      // Refresh the users list
      await refreshUsers();
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      toast({
        title: "Erro ao aprovar usuário",
        description: error.message || "Não foi possível aprovar o usuário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setApproving(false);
    }
  };

  return { approveUser, approving };
};
