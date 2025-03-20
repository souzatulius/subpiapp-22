
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useUserDelete = (fetchData: () => Promise<void>) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleDeleteUser = async () => {
    if (!currentUser?.id) return;
    
    try {
      // First, delete from auth.users (which will cascade to public.usuarios)
      const { error } = await supabase.auth.admin.deleteUser(
        currentUser.id
      );
      
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
    }
  };

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentUser,
    setCurrentUser,
    handleDeleteUser,
    openDeleteDialog,
  };
};
