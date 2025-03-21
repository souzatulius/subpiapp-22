
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useUserAccessRemoval = (fetchData: () => Promise<void>) => {
  const [removing, setRemoving] = useState(false);

  const removeUserAccess = async (userId: string, userName: string) => {
    if (!userId) return;
    
    setRemoving(true);
    
    try {
      // Delete all permissions for the user
      const { error } = await supabase
        .from('usuario_permissoes')
        .delete()
        .eq('usuario_id', userId);
      
      if (error) throw error;
      
      toast({
        title: 'Acesso removido',
        description: `O acesso de ${userName} foi removido com sucesso.`,
      });
      
      // Refresh data to update the UI
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao remover acesso do usuário:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível remover o acesso: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setRemoving(false);
    }
  };
  
  return {
    removing,
    removeUserAccess
  };
};
