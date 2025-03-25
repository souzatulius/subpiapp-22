
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserAccessRemoval = (fetchData: () => Promise<void>) => {
  const [removing, setRemoving] = useState(false);

  const removeAccess = async (userId: string, userName: string) => {
    if (!userId) return;
    
    setRemoving(true);
    try {
      // Remove all permissions for this user
      const { error } = await supabase
        .from('usuarios_permissoes')
        .delete()
        .eq('usuario_id', userId);
      
      if (error) throw error;
      
      toast({
        title: 'Acesso removido',
        description: `Todas as permissões de ${userName} foram removidas.`,
      });
      
      // Refresh users data
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao remover acesso do usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível remover o acesso do usuário. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setRemoving(false);
    }
  };

  return {
    removing,
    removeAccess
  };
};
