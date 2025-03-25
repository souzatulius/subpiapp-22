
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, UserFormData } from '../types';

export const useUserEdit = (fetchData: () => Promise<void>) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditUser = async (data: UserFormData) => {
    if (!currentUser?.id) return;
    
    setIsSubmitting(true);
    
    try {
      // Clean up data before submission
      const cleanData: any = {
        nome_completo: data.nome_completo,
        whatsapp: data.whatsapp || null,
        aniversario: data.aniversario ? data.aniversario.toISOString() : null,
      };
      
      // Process coordination fields
      // Set to null if not selected or "select-" default value
      cleanData.cargo_id = data.cargo_id && !data.cargo_id.startsWith('select-') 
        ? data.cargo_id 
        : null;
        
      cleanData.coordenacao_id = data.coordenacao_id && !data.coordenacao_id.startsWith('select-') 
        ? data.coordenacao_id 
        : null;
        
      cleanData.area_coordenacao_id = data.area_coordenacao_id && !data.area_coordenacao_id.startsWith('select-')
        ? data.area_coordenacao_id 
        : null;
      
      console.log('Updating user with data:', cleanData);
      
      const { error } = await supabase
        .from('usuarios')
        .update(cleanData)
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: 'Usuário atualizado',
        description: 'As informações do usuário foram atualizadas com sucesso.',
      });
      
      // Refresh users data
      await fetchData();
      
      // Close dialog
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Erro ao editar usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar o usuário. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
    setCurrentUser,
    handleEditUser,
    openEditDialog,
    isSubmitting
  };
};
