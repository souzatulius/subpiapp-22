
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const usePasswordReset = () => {
  const [isResetting, setIsResetting] = useState(false);

  const handleSendPasswordReset = async (user: User) => {
    if (!user.email) {
      toast({
        title: "Erro",
        description: "Email do usuário não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    setIsResetting(true);
    
    try {
      // Use Supabase auth methods directly - no need to access table 'users'
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: `Um email de redefinição de senha foi enviado para ${user.email}.`
      });
    } catch (error) {
      console.error('Erro ao enviar email de redefinição de senha:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o email de redefinição. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return {
    isResetting,
    handleSendPasswordReset
  };
};
