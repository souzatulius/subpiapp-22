
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const usePasswordReset = () => {
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

  return {
    handleSendPasswordReset
  };
};
