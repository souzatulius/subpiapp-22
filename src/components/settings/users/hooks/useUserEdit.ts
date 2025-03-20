
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User, UserFormData } from '../types';
import { format } from 'date-fns';

export const useUserEdit = (fetchData: () => Promise<void>) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditUser = async (data: UserFormData) => {
    try {
      if (!currentUser) return;
      
      const updateData: any = {
        nome_completo: data.nome_completo,
        cargo_id: data.cargo_id || null,
        area_coordenacao_id: data.area_coordenacao_id || null,
      };
      
      if (data.whatsapp !== undefined) {
        updateData.whatsapp = data.whatsapp || null;
      }
      
      if (data.aniversario) {
        updateData.aniversario = format(data.aniversario, 'yyyy-MM-dd');
      }
      
      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', currentUser.id);
        
      if (error) throw error;
      
      toast({
        title: 'Usuário atualizado',
        description: 'Os dados do usuário foram atualizados com sucesso',
      });
      
      setIsEditDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message || 'Ocorreu um erro ao atualizar os dados do usuário.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    handleEditUser,
    openEditDialog
  };
};
