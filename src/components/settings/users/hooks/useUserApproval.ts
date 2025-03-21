
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { sendApprovalEmail } from '@/lib/authUtils';

export const useUserApproval = (fetchUsers: () => Promise<void>) => {
  const [approving, setApproving] = useState(false);

  // Function to approve a user by assigning them the specified permission
  const approveUser = async (userId: string, userName: string, userEmail: string, permissionLevel = "Restrito") => {
    setApproving(true);
    console.log(`Approving user ${userId} with permission level ${permissionLevel}`);
    
    try {
      // Get permission ID for the specified level
      const { data: permission, error: permissionError } = await supabase
        .from('permissoes')
        .select('id')
        .eq('descricao', permissionLevel)
        .maybeSingle();
        
      if (permissionError) {
        console.error('Error fetching permission:', permissionError);
        throw permissionError;
      }
      
      let permissionId;
      
      // If permission doesn't exist, create it
      if (!permission) {
        console.log(`Permission "${permissionLevel}" not found, creating it...`);
        
        // Determine nivel_acesso based on permissionLevel
        let nivelAcesso = 10; // Default for Restrito
        
        switch (permissionLevel) {
          case 'Admin':
            nivelAcesso = 100;
            break;
          case 'Subprefeito':
            nivelAcesso = 90;
            break;
          case 'Time de Comunicação':
            nivelAcesso = 80;
            break;
          case 'Gestores':
            nivelAcesso = 70;
            break;
          // Restrito stays at 10
        }
        
        // Insert the permission with appropriate nivel_acesso
        const { data: newPermission, error: createError } = await supabase
          .from('permissoes')
          .insert({
            descricao: permissionLevel,
            nivel_acesso: nivelAcesso
          })
          .select('id')
          .single();
        
        if (createError) {
          console.error('Error creating permission:', createError);
          throw createError;
        }
        
        if (!newPermission) throw new Error(`Não foi possível criar a permissão "${permissionLevel}"`);
        
        permissionId = newPermission.id;
        console.log(`Created "${permissionLevel}" permission with ID: ${permissionId}`);
      } else {
        permissionId = permission.id;
      }
      
      // Assign permission to user
      const { error: assignError } = await supabase
        .from('usuario_permissoes')
        .insert({
          usuario_id: userId,
          permissao_id: permissionId
        });
        
      if (assignError) {
        console.error('Error assigning permission:', assignError);
        throw assignError;
      }
      
      // Send approval email
      await sendApprovalEmail(userId);
      
      // Create notification for the user
      await supabase
        .from('notificacoes')
        .insert({
          usuario_id: userId,
          mensagem: `Seu cadastro foi aprovado com nível de acesso "${permissionLevel}". Você já pode acessar o sistema.`,
          tipo: 'sistema'
        });
      
      toast({
        title: 'Usuário aprovado',
        description: `${userName} (${userEmail}) agora tem acesso ao sistema com nível "${permissionLevel}".`,
      });
      
      // Refresh users list
      await fetchUsers();
    } catch (error: any) {
      console.error('Erro ao aprovar usuário:', error);
      toast({
        title: 'Erro ao aprovar usuário',
        description: error.message || 'Ocorreu um erro ao aprovar o usuário.',
        variant: 'destructive',
      });
    } finally {
      setApproving(false);
    }
  };

  return {
    approving,
    approveUser
  };
};
