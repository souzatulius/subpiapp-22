
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User } from './types';

export const useUserInfo = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
    setValidationErrors([]);
  };

  const validateUserData = (data: { whatsapp?: string; aniversario?: string }) => {
    const errors: string[] = [];
    
    // No validation errors here as we're handling them in the form
    
    return errors;
  };

  const handleUpdateUserInfo = async (userId: string, data: { whatsapp?: string; aniversario?: string }) => {
    setSaving(true);
    setValidationErrors([]);
    
    try {
      // Validate the data
      const errors = validateUserData(data);
      if (errors.length > 0) {
        setValidationErrors(errors);
        throw new Error("Verifique os campos obrigatórios");
      }
      
      // Call our new secure function instead of direct update
      const { data: result, error } = await supabase.rpc('update_user_profile', {
        user_id: userId,
        user_nome_completo: currentUser?.nome_completo,
        user_whatsapp: data.whatsapp,
        user_aniversario: data.aniversario,
        user_foto_perfil_url: currentUser?.foto_perfil_url,
        user_cargo_id: currentUser?.cargo_id,
        user_coordenacao_id: currentUser?.coordenacao_id,
        user_supervisao_tecnica_id: currentUser?.supervisao_tecnica_id
      });
        
      if (error) {
        console.error('Database error:', error);
        throw new Error("Erro ao atualizar os dados. " + error.message);
      }
      
      if (!result) {
        throw new Error("Não foi possível atualizar os dados do usuário");
      }
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { 
          ...user, 
          ...data 
        } : user
      ));
      
      toast({
        title: 'Informações atualizadas',
        description: 'As informações do usuário foram atualizadas com sucesso',
      });
      
      // Close edit dialog
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Erro ao atualizar informações do usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar as informações do usuário.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    saving,
    validationErrors,
    openEditDialog,
    handleUpdateUserInfo
  };
};
