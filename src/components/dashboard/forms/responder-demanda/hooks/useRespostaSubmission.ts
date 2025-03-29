
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
      toast({
        title: "Validação falhou",
        description: validation.message,
        variant: "destructive"
      });
      return false;
    }

    if (!selectedDemanda || !user) {
      console.error("Missing selectedDemanda or user", { selectedDemanda, user });
      return false;
    }

    try {
      setIsSubmitting(true);
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
      
      toast({
        title: "Resposta enviada com sucesso!",
        description: "A demanda foi respondida."
      });

      if (options?.onSuccess) {
        console.log("Calling onSuccess callback");
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
