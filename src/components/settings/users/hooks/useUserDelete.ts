
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useUserDelete = (fetchData: () => Promise<void>) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteUser = async () => {
    if (!userToDelete?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', userToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi excluído com sucesso.',
      });
      
      // Refresh users data
      await fetchData();
      
      // Close dialog
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível excluir o usuário. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const deleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    deleteUser,
    openDeleteDialog,
    isSubmitting
  };
};
