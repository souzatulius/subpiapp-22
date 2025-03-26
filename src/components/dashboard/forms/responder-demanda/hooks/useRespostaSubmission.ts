
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { Demanda } from '../types';
import { useRespostaFormatter } from './useRespostaFormatter';
import { useRespostaValidation } from './useRespostaValidation';

interface SubmissionOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useRespostaSubmission = (options?: SubmissionOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { formatRespostaText } = useRespostaFormatter();
  const { validateResposta } = useRespostaValidation();

  /**
   * Updates the demand status
   */
  const updateDemandaStatus = async (demandaId: string, status: string) => {
    const { error } = await supabase
      .from('demandas')
      .update({ status })
      .eq('id', demandaId);
    
    if (error) throw error;
  };

  /**
   * Submits the response to the database
   */
  const submitResposta = async (
    selectedDemanda: Demanda | null,
    resposta: Record<string, string>,
    comentarios: string | null = null
  ) => {
    // Validate the response
    const validation = validateResposta(selectedDemanda, resposta);
    if (!validation.isValid) {
      toast({
        title: "Validação falhou",
        description: validation.message,
        variant: "destructive"
      });
      return false;
    }

    if (!selectedDemanda || !user) return false;

    try {
      setIsSubmitting(true);

      // Set status to "in progress" to indicate we're handling it
      await updateDemandaStatus(selectedDemanda.id, 'em_andamento');

      // Generate text summary of responses
      const respostasText = formatRespostaText(selectedDemanda, resposta);

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
        
      if (respostaError) throw respostaError;

      // Update status to "responded"
      await updateDemandaStatus(selectedDemanda.id, 'respondida');
      
      toast({
        title: "Resposta enviada com sucesso!",
        description: "A demanda foi respondida e seu status foi atualizado."
      });

      if (options?.onSuccess) {
        options.onSuccess();
      }

      return true;
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      
      toast({
        title: "Erro ao enviar resposta",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
      
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
