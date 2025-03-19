import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { completeEmailWithDomain } from '@/lib/authUtils';
import { format } from 'date-fns';
import { User, UserFormData } from './types';

export const useUserActions = (fetchData: () => Promise<void>) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleInviteUser = async (data: { 
    email: string; 
    nome_completo: string; 
    cargo_id?: string; 
    area_coordenacao_id?: string;
  }) => {
    try {
      const email = completeEmailWithDomain(data.email);
      
      const { data: existingUser, error: checkError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingUser) {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            nome_completo: data.nome_completo,
            cargo_id: data.cargo_id || null,
            area_coordenacao_id: data.area_coordenacao_id || null,
          })
          .eq('id', existingUser.id);
          
        if (updateError) throw updateError;
        
        toast({
          title: 'Usuário atualizado',
          description: `As informações do usuário ${email} foram atualizadas`,
        });
        
        setIsInviteDialogOpen(false);
        fetchData();
        return;
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12),
        options: {
          data: {
            name: data.nome_completo,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (authError) throw authError;

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: newUserData, error: userError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (userError) throw userError;
      
      if (newUserData) {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            nome_completo: data.nome_completo,
            cargo_id: data.cargo_id || null,
            area_coordenacao_id: data.area_coordenacao_id || null,
          })
          .eq('id', newUserData.id);
          
        if (updateError) throw updateError;
      }
      
      toast({
        title: 'Convite enviado',
        description: `Um convite foi enviado para ${email}`,
      });
      
      setIsInviteDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao convidar usuário:', error);
      
      let mensagemErro = 'Ocorreu um erro ao enviar o convite.';
      
      if (error.message) {
        if (error.message.includes('already registered')) {
          mensagemErro = 'Este email já está registrado no sistema.';
        } else if (error.message.includes('invalid email')) {
          mensagemErro = 'O formato do email é inválido.';
        }
      }
      
      toast({
        title: 'Erro ao convidar usuário',
        description: mensagemErro,
        variant: 'destructive',
      });
    }
  };

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

  const handleDeleteUser = async () => {
    try {
      if (!currentUser) return;
      
      const { error } = await supabase.auth.admin.deleteUser(currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi excluído com sucesso',
      });
      
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message || 'Ocorreu um erro ao excluir o usuário.',
        variant: 'destructive',
      });
    }
  };

  const handleSendPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email enviado',
        description: 'Um email de redefinição de senha foi enviado',
      });
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição de senha:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao enviar o email de redefinição de senha.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  return {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentUser,
    handleInviteUser,
    handleEditUser,
    handleDeleteUser,
    handleSendPasswordReset,
    openEditDialog,
    openDeleteDialog,
  };
};
