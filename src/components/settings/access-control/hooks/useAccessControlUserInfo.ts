
import { useState } from 'react';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { parseFormattedDate } from '@/lib/inputFormatting';

export const useAccessControlUserInfo = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  fetchData: () => Promise<void>
) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUserInfo = async (userId: string, data: { whatsapp?: string; aniversario?: string }) => {
    setSaving(true);
    
    try {
      // Process date if provided
      let aniversarioDate = null;
      if (data.aniversario) {
        const parsedDate = parseFormattedDate(data.aniversario);
        if (parsedDate) {
          aniversarioDate = parsedDate.toISOString();
        }
      }
      
      // Update directly in 'usuarios' table
      const { error } = await supabase
        .from('usuarios')
        .update({
          whatsapp: data.whatsapp || null,
          aniversario: aniversarioDate
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { 
          ...user, 
          whatsapp: data.whatsapp, 
          aniversario: aniversarioDate
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
    openEditDialog,
    handleUpdateUserInfo
  };
};
