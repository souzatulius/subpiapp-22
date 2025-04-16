
import { useState } from 'react';
import { Demanda } from '../types';
import { useRespostaSubmission } from './useRespostaSubmission';

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
  
  // Pass showSuccessToast: false to the useRespostaSubmission hook
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
      return;
    }
    
    if (Object.keys(resposta).length === 0) {
      console.error("Nenhuma resposta fornecida");
      return;
    }
    
    // Verificar se todas as perguntas foram respondidas
    const hasEmptyAnswers = Object.values(resposta).some(r => !r || r.trim() === '');
    if (hasEmptyAnswers) {
      console.error("Algumas respostas estão vazias");
      return;
    }
    
    // Chamamos a função submitResposta do hook useRespostaSubmission
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
