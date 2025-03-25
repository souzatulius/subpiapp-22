
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserApproval = (fetchData: () => Promise<void>) => {
  const [approving, setApproving] = useState(false);

  const approveUser = async (userId: string, userName: string, userEmail: string, roleName: string = 'leitor', contextData?: { coordenacao_id?: string, supervisao_tecnica_id?: string }) => {
    if (!userId) return;
    
    setApproving(true);
    try {
      // 1. Get the role ID based on the role name
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('role_nome', roleName)
        .single();
      
      if (roleError) throw roleError;
      
      if (!roleData) {
        throw new Error(`Role "${roleName}" not found.`);
      }
      
      // 2. Associate the user with the role
      const { error: assignError } = await supabase
        .from('usuario_roles')
        .insert({
          usuario_id: userId,
          role_id: roleData.id,
          coordenacao_id: contextData?.coordenacao_id || null,
          supervisao_tecnica_id: contextData?.supervisao_tecnica_id || null
        });
      
      if (assignError) throw assignError;
      
      toast({
        title: 'Acesso aprovado',
        description: `O usuário ${userName} agora tem acesso como "${roleName}".`,
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
