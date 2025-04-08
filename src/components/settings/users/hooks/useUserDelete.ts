
import { useState } from 'react';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useUserDelete = (fetchData: () => Promise<void>) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUser = async (userId: string) => {
    if (!userId) return;
    
    setIsDeleting(true);
    
    try {
      // Update user status to 'excluido' in the correct table 'usuarios'
      const { error } = await supabase
        .from('usuarios')
        .update({ status: 'excluido' })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi excluído com sucesso.',
      });
      
      // Refresh users list
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível excluir o usuário.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      console.error('Nenhum usuário selecionado para exclusão');
      toast({
        title: 'Erro',
        description: 'Nenhum usuário selecionado para exclusão.',
        variant: 'destructive',
      });
      return;
    }
    
    return await deleteUser(userToDelete.id);
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    deleteUser,
    isDeleting,
  };
};
