
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, UserFormData } from '../types';
import { parseFormattedDate } from '@/lib/inputFormatting';

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
        cargo_id: data.cargo_id || null,
        coordenacao_id: data.coordenacao_id || null,
        supervisao_tecnica_id: data.supervisao_tecnica_id || null
      };
      
      // Process whatsapp
      cleanData.whatsapp = data.whatsapp || null;
      
      // Process birthday - ensure it's in ISO format for database storage
      if (data.aniversario) {
        if (typeof data.aniversario === 'string') {
          // Try to parse the string date
          const parsedDate = parseFormattedDate(data.aniversario);
          cleanData.aniversario = parsedDate ? parsedDate.toISOString() : null;
        } else if (data.aniversario instanceof Date) {
          cleanData.aniversario = data.aniversario.toISOString();
        } else {
          cleanData.aniversario = null;
        }
      } else {
        cleanData.aniversario = null;
      }
      
      // Include photo profile URL if present
      if (data.foto_perfil_url) {
        cleanData.foto_perfil_url = data.foto_perfil_url;
      }
      
      console.log('Updating user with data:', cleanData);
      
      // Update user in 'usuarios' table
      const { error } = await supabase
        .from('usuarios')
        .update(cleanData)
        .eq('id', currentUser.id);
      
      if (error) {
        // Special handling for protected fields
        if (error.message && error.message.includes('protected fields')) {
          throw new Error('Alguns campos são protegidos e não podem ser alterados. Apenas administradores podem modificar cargo, coordenação e supervisão técnica.');
        } else {
          throw error;
        }
      }
      
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
