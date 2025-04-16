
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { Demanda } from '../types';
import { useRespostaFormatter } from './useRespostaFormatter';
import { useRespostaValidation } from './useRespostaValidation';

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
  const { showFeedback } = useAnimatedFeedback();

  /**
   * Submits the response to the database
   */
  const submitResposta = async (
    selectedDemanda: Demanda | null,
    resposta: Record<string, string>,
    comentarios: string | null = null
  ): Promise<boolean> => {
    console.log("Submit resposta called", { selectedDemanda, resposta, comentarios });
    
    // Validate the response
    const validation = validateResposta(selectedDemanda, resposta);
    if (!validation.isValid) {
      showFeedback('error', validation.message);
      return false;
    }

    if (!selectedDemanda || !user) {
      console.error("Missing selectedDemanda or user", { selectedDemanda, user });
      return false;
    }

    try {
      setIsSubmitting(true);
      
      // Show loading feedback
      showFeedback('loading', 'Enviando resposta...', { progress: 30, stage: 'Processando' });
      
      console.log("Setting status to em_andamento");

      // First, save the response without changing the status
      // Generate text summary of responses
      const respostasText = formatRespostaText(selectedDemanda, resposta);
      console.log("Generated respostasText", respostasText);

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
        console.error("Error inserting response:", respostaError);
        throw respostaError;
      }

      console.log("Response inserted successfully");
      
      // Update feedback progress
      showFeedback('loading', 'Atualizando status da demanda...', { progress: 70, stage: 'Finalizando' });
      
      // Now try to update the status to "em_andamento"
      // This is safer since the response is already saved
      try {
        await supabase
          .from('demandas')
          .update({ status: 'em_andamento' })
          .eq('id', selectedDemanda.id);
          
        console.log("Status updated to em_andamento");
      } catch (statusError) {
        console.warn("Could not update status to em_andamento, continuing anyway", statusError);
        // We continue anyway since the response is saved
      }
      
      // Show animated feedback 
      showFeedback('success', 'Resposta enviada com sucesso!');

      if (options?.onSuccess) {
        console.log("Calling onSuccess callback");
        options.onSuccess();
      }

      return true;
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      
      showFeedback('error', error.message || "Ocorreu um erro ao processar sua solicitação");
      
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
