
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demanda } from '../types';
import { useRespostaFormatter } from './useRespostaFormatter';
import { useRespostaValidation } from './useRespostaValidation';
import { useFeedback } from '@/components/ui/feedback-provider';

interface SubmissionOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  showSuccessToast?: boolean; // Option is kept for backward compatibility
}

export const useRespostaSubmission = (options?: SubmissionOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { formatRespostaText } = useRespostaFormatter();
  const { validateResposta } = useRespostaValidation();
  const { showFeedback } = useFeedback();

  /**
   * Submits the response to the database
   */
  const submitResposta = async (
    selectedDemanda: Demanda | null,
    resposta: Record<string, string>,
    comentarios: string | null = null
  ): Promise<boolean> => {
    // Validate the response
    const validation = validateResposta(selectedDemanda, resposta);
    if (!validation.isValid) {
      showFeedback('error', validation.message || 'Erro na validação de respostas');
      return false;
    }

    if (!selectedDemanda || !user) {
      showFeedback('error', 'Demanda ou usuário inválido');
      return false;
    }

    try {
      setIsSubmitting(true);
      showFeedback('loading', 'Preparando resposta...', { progress: 20 });
      
      // Generate text summary of responses
      const respostasText = formatRespostaText(selectedDemanda, resposta);

      showFeedback('loading', 'Enviando resposta...', { progress: 50 });
      
      // Insert the response
      const { error: respostaError } = await supabase
        .from('respostas_demandas')
        .insert({
          demanda_id: selectedDemanda.id,
          usuario_id: user.id,
          respostas: resposta,
          texto: respostasText,
          comentarios: comentarios || null
        });
        
      if (respostaError) {
        throw respostaError;
      }

      showFeedback('loading', 'Atualizando status...', { progress: 80 });
      
      // Now try to update the status to "em_andamento"
      // This is safer since the response is already saved
      try {
        await supabase
          .from('demandas')
          .update({ status: 'em_andamento' })
          .eq('id', selectedDemanda.id);
      } catch (statusError) {
        console.warn("Could not update status to em_andamento, continuing anyway", statusError);
        // We continue anyway since the response is saved
      }

      showFeedback('success', 'Resposta enviada com sucesso!');

      if (options?.onSuccess) {
        options.onSuccess();
      }

      return true;
    } catch (error: any) {
      showFeedback('error', `Erro ao enviar resposta: ${error.message || 'Erro desconhecido'}`);
      
      if (options?.onError) {
        options.onError(error);
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitResposta
  };
};
