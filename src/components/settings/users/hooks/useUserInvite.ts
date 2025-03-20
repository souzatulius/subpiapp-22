
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { completeEmailWithDomain } from '@/lib/authUtils';

export const useUserInvite = (fetchData: () => Promise<void>) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

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

  return {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    handleInviteUser
  };
};
