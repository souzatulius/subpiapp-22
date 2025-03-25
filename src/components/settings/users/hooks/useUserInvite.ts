
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { completeEmailWithDomain } from '@/lib/authUtils';

interface InviteUserData {
  email: string;
  nome_completo: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
}

export const useUserInvite = (fetchData: () => Promise<void>) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInviteUser = async (data: InviteUserData) => {
    try {
      setIsSubmitting(true);
      
      // Prepare email with domain if needed
      const email = completeEmailWithDomain(data.email);
      
      // Clean up the data for submission
      const cleanData: any = {
        nome_completo: data.nome_completo,
        email: email,
      };
      
      // Only include fields that are valid (not placeholder values)
      if (data.cargo_id && data.cargo_id !== 'select-cargo') {
        cleanData.cargo_id = data.cargo_id;
      }
      
      if (data.coordenacao_id && data.coordenacao_id !== 'select-coordenacao') {
        cleanData.coordenacao_id = data.coordenacao_id;
      }
      
      if (data.supervisao_tecnica_id && data.supervisao_tecnica_id !== 'select-supervisao') {
        cleanData.supervisao_tecnica_id = data.supervisao_tecnica_id;
      }
      
      console.log('Inviting user with data:', cleanData);
      
      // First, create the Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2) + '!',
        options: {
          data: {
            name: data.nome_completo,
            role_id: cleanData.cargo_id || null,
            coordenacao_id: cleanData.coordenacao_id || null,
            supervision_id: cleanData.supervisao_tecnica_id || null,
          }
        }
      });
      
      if (authError) throw authError;
      
      // The user will be created in usuarios table automatically via trigger
      
      toast({
        title: 'Usuário convidado',
        description: `Um convite foi enviado para ${email}`,
      });
      
      // Refresh users data
      await fetchData();
      
      // Close dialog
      setIsInviteDialogOpen(false);
    } catch (error: any) {
      console.error('Erro ao convidar usuário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar o convite. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    handleInviteUser,
    isSubmitting
  };
};
