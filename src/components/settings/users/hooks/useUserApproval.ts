
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useUserApproval = (refreshUsers: () => Promise<void>) => {
  const [approving, setApproving] = useState(false);

  const approveUser = async (userId: string, userName: string, userEmail: string) => {
    setApproving(true);
    
    try {
      console.log(`Iniciando aprovação do usuário: ${userName}, ID: ${userId}`);
      
      // Update both status and status_conta to "ativo" in the usuarios table
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ 
          status: 'ativo',
          status_conta: 'ativo' 
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Erro ao atualizar status do usuário:', updateError);
        throw updateError;
      }
      
      console.log('Status do usuário atualizado com sucesso');
      
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
        console.error('Erro ao atribuir permissão de admin:', permissionAssignError);
        throw permissionAssignError;
      }
      
      console.log('Permissão de admin atribuída com sucesso');
      
      // Try to send an approval email via the Edge Function if available
      try {
        console.log('Tentando enviar notificação por email...');
        const response = await fetch(`${window.location.origin}/api/send-approval-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        
        const { error: notificationError } = await response.json();
        
        if (notificationError) {
          console.warn('Error sending approval notification:', notificationError);
        } else {
          console.log('Email de notificação enviado com sucesso');
        }
      } catch (emailError) {
        console.warn('Could not send approval email notification:', emailError);
      }
      
      // Successfully updated user status and assigned permission
      toast({
        title: "Usuário aprovado",
        description: `${userName} (${userEmail}) agora tem acesso ao sistema com permissão de Administrador.`
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
