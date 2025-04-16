
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demanda } from '@/components/dashboard/forms/responder-demanda/types';
import { useRespostaSubmission } from '@/components/dashboard/forms/responder-demanda/hooks/useRespostaSubmission';
import { useFeedback } from '@/components/ui/feedback-provider';

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
  const { showFeedback } = useFeedback();
  
  // Initialize useRespostaSubmission hook with showSuccessToast=false
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
      showFeedback('loading', 'Enviando resposta...', { progress: 30 });
      
      // Use the submitResposta function from useRespostaSubmission
      const success = await submitResposta(selectedDemanda, resposta, comentarios);
      
      if (success) {
        showFeedback('success', 'Demanda respondida com sucesso');
        
        // Update local state
        setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
        setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
        setSelectedDemanda(null);
        setResposta({});
        setComentarios('');
      } else {
        showFeedback('error', 'Não foi possível enviar a resposta. Tente novamente.');
      }
    } catch (error: any) {
      showFeedback('error', `Erro ao enviar resposta: ${error.message || 'Erro desconhecido'}`);
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
