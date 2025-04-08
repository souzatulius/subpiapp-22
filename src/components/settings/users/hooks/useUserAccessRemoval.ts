
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useUserAccessRemoval = (refreshUsers: () => Promise<void>) => {
  const [removing, setRemoving] = useState(false);

  const removeAccess = async (user: User) => {
    if (!user?.id) return;
    
    setRemoving(true);
    
    try {
      console.log(`Removendo acesso do usuário: ${user.nome_completo}, ID: ${user.id}`);
      
      // Delete all permissions for this user
      const { error: deletePermissionsError } = await supabase
        .from('usuario_permissoes')
        .delete()
        .eq('usuario_id', user.id);
      
      if (deletePermissionsError) throw deletePermissionsError;
      
      // Update user status in the 'usuarios' table (not 'users')
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ status: 'pendente' })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Acesso removido",
        description: `As permissões de ${user.nome_completo} foram removidas.`
      });
      
      // Refresh the users list
      await refreshUsers();
    } catch (error) {
      console.error('Erro ao remover acesso do usuário:', error);
      toast({
        title: "Erro ao remover acesso",
        description: error.message || "Não foi possível remover o acesso do usuário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setRemoving(false);
    }
  };

  return { removeAccess, removing };
};
