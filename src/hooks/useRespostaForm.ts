
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { Demanda } from '@/components/dashboard/forms/responder-demanda/types';
import { useRespostaSubmission } from '@/components/dashboard/forms/responder-demanda/hooks/useRespostaSubmission';

export const useRespostaForm = (
  selectedDemanda: Demanda | null,
  setSelectedDemanda: (demanda: Demanda | null) => void,
  demandas: Demanda[],
  setDemandas: (demandas: Demanda[]) => void,
  filteredDemandas: Demanda[],
  setFilteredDemandas: (demandas: Demanda[]) => void
) => {
  const { user } = useAuth();
  const [resposta, setResposta] = useState<Record<string, string>>({});
  const [comentarios, setComentarios] = useState<string>('');
  const { showFeedback } = useAnimatedFeedback();
  
  // Initialize useRespostaSubmission hook with showSuccessToast=false
  // to prevent duplicate toasts as we'll show our own feedback here
  const { isSubmitting, submitResposta } = useRespostaSubmission({
    showSuccessToast: false
  });

  const handleRespostaChange = (key: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmitResposta = async () => {
    if (!selectedDemanda || Object.keys(resposta).length === 0) {
      showFeedback('error', 'Por favor, responda todas as perguntas da demanda');
      return;
    }
    
    try {
      // Use the submitResposta function from useRespostaSubmission
      const success = await submitResposta(selectedDemanda, resposta, comentarios);
      
      if (success) {
        // Only show feedback here since we disabled it in the submission hook
        showFeedback('success', 'Demanda respondida com sucesso');
        
        // Update local state
        setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
        setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
        setSelectedDemanda(null);
        setResposta({});
        setComentarios('');
      }
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      showFeedback('error', error.message || "Ocorreu um erro ao processar sua solicitação");
    }
  };

  return {
    resposta,
    setResposta,
    comentarios,
    setComentarios,
    isLoading: isSubmitting,
    handleSubmitResposta,
    handleRespostaChange
  };
};
