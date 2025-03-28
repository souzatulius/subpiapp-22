
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User } from '../types';

export const useUserAccessRemoval = (fetchData: () => Promise<void>) => {
  const [removing, setRemoving] = useState(false);

  const removeAccess = async (user: User) => {
    if (!user || !user.id) {
      console.error('Usuário inválido para remoção de acesso');
      toast({
        title: 'Erro',
        description: 'Usuário inválido para remoção de acesso.',
        variant: 'destructive',
      });
      return;
    }

    setRemoving(true);

    try {
      // First, delete all user permissions
      const { error: permissionsError } = await supabase
        .from('usuario_permissoes')
        .delete()
        .eq('usuario_id', user.id);

      if (permissionsError) {
        throw permissionsError;
      }

      // Update status in usuarios table
      const { error: statusError } = await supabase
        .from('usuarios')
        .update({ status: 'pendente' })
        .eq('id', user.id);

      if (statusError) {
        throw statusError;
      }

      toast({
        title: 'Permissões removidas',
        description: `As permissões de acesso de ${user.nome_completo} foram removidas com sucesso.`,
      });

      // Refresh data
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao remover permissões:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível remover as permissões do usuário.',
        variant: 'destructive',
      });
    } finally {
      setRemoving(false);
    }
  };

  return {
    removeAccess,
    removing
  };
};
