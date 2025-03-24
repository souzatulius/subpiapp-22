
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTokenManagement = () => {
  const [error, setError] = useState<string | null>(null);

  // Save token to Supabase
  const saveTokenToDatabase = async (token: string): Promise<boolean> => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const userId = userData.user?.id;
      if (!userId) throw new Error('Usuário não autenticado');

      const navegador = getBrowserInfo();

      // Check if token already exists for this user and browser
      const { data: existingTokens, error: fetchError } = await supabase
        .from('tokens_notificacoes')
        .select('id')
        .eq('user_id', userId)
        .eq('navegador', navegador);

      if (fetchError) throw fetchError;

      if (existingTokens && existingTokens.length > 0) {
        // Update existing token
        const { error: updateError } = await supabase
          .from('tokens_notificacoes')
          .update({ fcm_token: token })
          .eq('id', existingTokens[0].id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new token
        const { error: insertError } = await supabase
          .from('tokens_notificacoes')
          .insert({
            user_id: userId,
            fcm_token: token,
            navegador: navegador
          });
          
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (err: any) {
      console.error('Error saving token to database:', err);
      setError(err.message || 'Erro ao salvar token no banco de dados');
      return false;
    }
  };

  // Get browser info
  const getBrowserInfo = (): string => {
    const userAgent = navigator.userAgent;
    let browserName = 'Desconhecido';
    
    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = 'Chrome';
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = 'Firefox';
    } else if (userAgent.match(/safari/i)) {
      browserName = 'Safari';
    } else if (userAgent.match(/opr\//i)) {
      browserName = 'Opera';
    } else if (userAgent.match(/edg/i)) {
      browserName = 'Edge';
    }
    
    return `${browserName} - ${userAgent}`;
  };

  return {
    saveTokenToDatabase,
    error,
    setError
  };
};
