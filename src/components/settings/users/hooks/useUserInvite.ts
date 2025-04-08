
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { completeEmailWithDomain } from '@/lib/authUtils';

export const useUserInvite = (refreshUsers: () => Promise<void>) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInviteUser = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const completeEmail = completeEmailWithDomain(data.email);
      
      // Format data for the invitation
      const userData = {
        nome_completo: data.nome_completo,
        cargo_id: data.cargo_id,
        supervisao_tecnica_id: data.area || null,
        coordenacao_id: data.coordenacao,
        status: 'aguardando_email'
      };
      
      console.log('Convidando usuário com os dados:', userData);
      
      // Create invitation record
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        completeEmail,
        {
          redirectTo: `${window.location.origin}/auth/callback`,
          data: userData
        }
      );
      
      if (inviteError) throw inviteError;
      
      toast({
        title: "Convite enviado",
        description: `Um email de convite foi enviado para ${completeEmail}.`
      });
      
      // Close dialog and refresh users list
      setIsInviteDialogOpen(false);
      await refreshUsers();
    } catch (error) {
      console.error('Erro ao convidar usuário:', error);
      
      if (error.message?.includes('duplicate key')) {
        toast({
          title: "Erro",
          description: "Este email já está registrado no sistema.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível enviar o convite. Tente novamente.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isSubmitting,
    handleInviteUser
  };
};
