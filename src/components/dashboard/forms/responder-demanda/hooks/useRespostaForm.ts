
import { useState } from 'react';
import { Demanda } from '../types';
import { useRespostaSubmission } from './useRespostaSubmission';
import { useFeedback } from '@/components/ui/feedback-provider';

export const useRespostaForm = (
  selectedDemanda: Demanda | null,
  setSelectedDemanda: (demanda: Demanda | null) => void,
  demandas: Demanda[],
  setDemandas: (demandas: Demanda[]) => void,
  filteredDemandas: Demanda[],
  setFilteredDemandas: (demandas: Demanda[]) => void
) => {
  const [resposta, setResposta] = useState<Record<string, string>>({});
  const [comentarios, setComentarios] = useState<string>('');
  const { showFeedback } = useFeedback();
  
  // Pass showSuccessToast: false to the useRespostaSubmission hook
  const { isSubmitting, submitResposta } = useRespostaSubmission({
    showSuccessToast: false,
    onSuccess: () => {
      // Update local state to remove the answered demand
      if (selectedDemanda) {
        showFeedback('success', 'Resposta enviada com sucesso!');
        
        setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
        setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
        setSelectedDemanda(null);
        setResposta({});
        setComentarios('');
      }
    },
    onError: (error) => {
      showFeedback('error', `Erro ao enviar resposta: ${error.message || 'Erro desconhecido'}`);
    }
  });

  const handleRespostaChange = (key: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmitResposta = async (): Promise<void> => {
    if (!selectedDemanda) {
      showFeedback('error', 'Nenhuma demanda selecionada');
      return;
    }
    
    if (Object.keys(resposta).length === 0) {
      showFeedback('error', 'Nenhuma resposta fornecida');
      return;
    }
    
    // Verificar se todas as perguntas foram respondidas
    const hasEmptyAnswers = Object.values(resposta).some(r => !r || r.trim() === '');
    if (hasEmptyAnswers) {
      showFeedback('error', 'Algumas respostas estão vazias. Por favor, responda todas as perguntas.');
      return;
    }
    
    showFeedback('loading', 'Enviando resposta...', { progress: 30 });
    
    // Chamamos a função submitResposta do hook useRespostaSubmission
    await submitResposta(selectedDemanda, resposta, comentarios);
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
