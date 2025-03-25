import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserApproval = (fetchData: () => Promise<void>) => {
  const [approving, setApproving] = useState(false);

  const approveUser = async (userId: string, userName: string, userEmail: string, permissionLevel?: string) => {
    if (!userId) return;
    
    setApproving(true);
    try {
      // 1. Get the permission ID based on the level
      const permissionLevel_ = permissionLevel || 'Restrito';
      
      const { data: permissionData, error: permissionError } = await supabase
        .from('permissoes')
        .select('id')
        .eq('descricao', permissionLevel_)
        .single();
      
      if (permissionError) throw permissionError;
      
      if (!permissionData) {
        throw new Error(`Permissão "${permissionLevel_}" não encontrada.`);
      }
      
      // 2. Associate the user with the permission
      const { error: assignError } = await supabase
        .from('usuarios_permissoes')
        .insert({
          usuario_id: userId,
          permissao_id: permissionData.id
        });
      
      if (assignError) throw assignError;
      
      // 3. Send approval notification if needed
      // This could call a serverless function to send an email
      
      toast({
        title: 'Acesso aprovado',
        description: `O usuário ${userName} agora tem acesso como "${permissionLevel_}".`,
      });
      
      // Refresh users data
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao aprovar usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível aprovar o acesso do usuário. Por favor, tente novamente.',
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
