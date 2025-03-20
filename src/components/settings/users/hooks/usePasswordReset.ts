
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePasswordReset = () => {
  const [resetting, setResetting] = useState(false);

  const handleSendPasswordReset = async (userId: string, email: string) => {
    setResetting(true);
    
    try {
      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email de redefinição enviado',
        description: `Um email de redefinição de senha foi enviado para ${email}`,
      });
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar o email de redefinição.',
        variant: 'destructive',
      });
    } finally {
      setResetting(false);
    }
  };

  return {
    resetting,
    handleSendPasswordReset,
  };
};
