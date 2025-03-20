
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { sendApprovalEmail } from '@/lib/authUtils';

export const useUserApproval = (fetchUsers: () => Promise<void>) => {
  const [approving, setApproving] = useState(false);

  // Function to approve a user by assigning them 'Restrito' permission
  const approveUser = async (userId: string, userName: string, userEmail: string) => {
    setApproving(true);
    
    try {
      // Get 'Restrito' permission ID - using maybeSingle() instead of single()
      const { data: permission, error: permissionError } = await supabase
        .from('permissoes')
        .select('id')
        .eq('descricao', 'Restrito')
        .maybeSingle();
        
      if (permissionError) throw permissionError;
      
      let permissionId;
      
      // If permission doesn't exist, create it
      if (!permission) {
        console.log('Permission "Restrito" not found, creating it...');
        
        // Insert the 'Restrito' permission with nivel_acesso 10
        const { data: newPermission, error: createError } = await supabase
          .from('permissoes')
          .insert({
            descricao: 'Restrito',
            nivel_acesso: 10
          })
          .select('id')
          .single();
        
        if (createError) throw createError;
        if (!newPermission) throw new Error('Não foi possível criar a permissão "Restrito"');
        
        permissionId = newPermission.id;
        console.log('Created "Restrito" permission with ID:', permissionId);
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
        
      if (assignError) throw assignError;
      
      // Send approval email
      await sendApprovalEmail(userId);
      
      // Create notification for the user
      await supabase
        .from('notificacoes')
        .insert({
          usuario_id: userId,
          mensagem: 'Seu cadastro foi aprovado. Você já pode acessar o sistema.',
          tipo: 'sistema'
        });
      
      toast({
        title: 'Usuário aprovado',
        description: `${userName} (${userEmail}) agora tem acesso ao sistema.`,
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
