
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFeedback } from '@/components/ui/feedback-provider';

export const useUserApproval = (refreshUsers: () => Promise<void>) => {
  const [approving, setApproving] = useState(false);
  const { showFeedback } = useFeedback();

  const approveUser = async (userId: string, userName: string, userEmail: string) => {
    setApproving(true);
    
    try {
      showFeedback('loading', `Aprovando usuário: ${userName}...`, { progress: 20 });
      
      // Update both status and status_conta to "ativo" in the usuarios table
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ 
          status: 'ativo',
          status_conta: 'ativo' 
        })
        .eq('id', userId);
      
      if (updateError) {
        throw updateError;
      }
      
      showFeedback('loading', 'Atribuindo permissões...', { progress: 50 });
      
      // Admin permission ID (fixed value)
      const adminPermissionId = '213c5690-ed4a-4b77-b565-39465b0a4247';
      
      // Always assign Admin permission to approved users
      const { error: permissionAssignError } = await supabase
        .from('usuario_permissoes')
        .insert({
          usuario_id: userId,
          permissao_id: adminPermissionId
        });
      
      if (permissionAssignError) {
        throw permissionAssignError;
      }
      
      showFeedback('loading', 'Enviando notificação...', { progress: 80 });
      
      // Try to send an approval email via the Edge Function if available
      try {
        const response = await fetch(`${window.location.origin}/api/send-approval-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        
        const { error: notificationError } = await response.json();
        
        if (notificationError) {
          console.warn('Error sending approval notification:', notificationError);
        }
      } catch (emailError) {
        console.warn('Could not send approval email notification:', emailError);
      }
      
      showFeedback('success', `Usuário ${userName} aprovado com sucesso!`);
      
      // Refresh the users list
      await refreshUsers();
    } catch (error: any) {
      showFeedback('error', `Erro ao aprovar usuário: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setApproving(false);
    }
  };

  return { approveUser, approving };
};
