
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useUserAccessRemoval = (fetchData: () => Promise<void>) => {
  const [removing, setRemoving] = useState(false);

  const removeAccess = async (user: User) => {
    if (!user.id) return;
    
    setRemoving(true);
    try {
      // Delete all roles for this user
      const { error } = await supabase
        .from('usuario_roles')
        .delete()
        .eq('usuario_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Acesso removido',
        description: `O acesso de ${user.nome_completo} foi removido com sucesso.`,
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
