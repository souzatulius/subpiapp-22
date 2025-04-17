
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demanda } from '../types';
import { useRespostaFormatter } from './useRespostaFormatter';
import { useRespostaValidation } from './useRespostaValidation';
import { toast } from '@/components/ui/use-toast';

interface SubmissionOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  showSuccessToast?: boolean;
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
      console.error(validation.message);
      return false;
    }

    if (!selectedDemanda || !user) {
      console.error("Missing selectedDemanda or user", { selectedDemanda, user });
      return false;
    }

    try {
      setIsSubmitting(true);
      
      console.log("Setting status to respondida"); // Changed from 'em_andamento' to 'respondida'

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
      
      // Now update the status to "respondida" instead of "em_andamento"
      try {
        const { error: updateError } = await supabase
          .from('demandas')
          .update({ status: 'respondida' })
          .eq('id', selectedDemanda.id);
          
        if (updateError) {
          console.error("Error updating status to respondida:", updateError);
          throw updateError;
        }
          
        console.log("Status updated to respondida");
        
        // Show success toast if enabled
        if (options?.showSuccessToast !== false) {
          toast({
            title: "Resposta enviada com sucesso",
            description: "A demanda foi respondida e está disponível para criação de nota.",
            variant: "default"
          });
        }
      } catch (statusError) {
        console.error("Could not update status to respondida:", statusError);
        // We continue anyway since the response is saved
      }

      if (options?.onSuccess) {
        console.log("Calling onSuccess callback");
        options.onSuccess();
      }

      return true;
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      
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
