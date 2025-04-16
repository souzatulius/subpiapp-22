
import { useState } from 'react';
import { Demanda } from '../types';
import { useRespostaSubmission } from './useRespostaSubmission';
import { toast } from '@/components/ui/use-toast';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

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
  const { showFeedback } = useAnimatedFeedback();
  
  // Pass showSuccessToast: false to the useRespostaSubmission hook
  // to let the submission hook handle showing the success message
  const { isSubmitting, submitResposta } = useRespostaSubmission({
    showSuccessToast: false,
    onSuccess: () => {
      // Update local state to remove the answered demand
      if (selectedDemanda) {
        console.log("Resposta enviada com sucesso. Atualizando listas locais.");
        setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
        setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
        setSelectedDemanda(null);
        setResposta({});
        setComentarios('');
      }
    },
    onError: (error) => {
      console.error("Erro ao enviar resposta:", error);
      showFeedback('error', 'Ocorreu um erro ao enviar a resposta. Por favor, tente novamente.');
    }
  });

  const handleRespostaChange = (key: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmitResposta = async (): Promise<void> => {
    console.log("handleSubmitResposta chamado", { selectedDemanda, resposta, comentarios });
    
    if (!selectedDemanda) {
      console.error("Nenhuma demanda selecionada");
      showFeedback('error', 'Nenhuma demanda selecionada para resposta.');
      return;
    }
    
    if (Object.keys(resposta).length === 0) {
      console.error("Nenhuma resposta fornecida");
      showFeedback('error', 'Por favor, forneça respostas para todas as perguntas.');
      return;
    }
    
    // Verificar se todas as perguntas foram respondidas
    const hasEmptyAnswers = Object.values(resposta).some(r => !r || r.trim() === '');
    if (hasEmptyAnswers) {
      console.error("Algumas respostas estão vazias");
      showFeedback('error', 'Por favor, responda a todas as perguntas antes de enviar.');
      return;
    }
    
    // Chamamos a função submitResposta do hook useRespostaSubmission
    // que já vai mostrar o feedback de sucesso por conta própria
    const result = await submitResposta(selectedDemanda, resposta, comentarios);
    console.log("Resultado do submitResposta:", result);
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
