
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
      
      // Update both status and status_conta to "ativo" in the usuarios table
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ 
          status: 'ativo',
          status_conta: 'ativo' 
        })
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
      
      // Try to send an approval email via the Edge Function if available
      try {
        const { error: notificationError } = await fetch(`${window.location.origin}/api/send-approval-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        }).then(res => res.json());
        
        if (notificationError) {
          console.warn('Error sending approval notification:', notificationError);
        }
      } catch (emailError) {
        console.warn('Could not send approval email notification:', emailError);
      }
      
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
