
import { useState } from 'react';
import { Demanda } from '../types';
import { useRespostaSubmission } from './useRespostaSubmission';
import { toast } from '@/components/ui/use-toast';

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
  
  // Pass showSuccessToast: true to the useRespostaSubmission hook
  // to control where the success message is shown
  const { isSubmitting, submitResposta } = useRespostaSubmission({
    showSuccessToast: true, // Let the submission hook handle the success toast
    onSuccess: () => {
      // Update local state to remove the answered demand
      if (selectedDemanda) {
        console.log("Resposta enviada com sucesso. Atualizando listas locais.");
        setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
        setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
        setSelectedDemanda(null);
        setResposta({});
        setComentarios('');
        
        // Remove duplicate toast here - we'll let useRespostaSubmission handle it
      }
    },
    onError: (error) => {
      console.error("Erro ao enviar resposta:", error);
      toast({
        title: "Erro ao enviar resposta",
        description: "Ocorreu um erro ao enviar a resposta. Por favor, tente novamente.",
        variant: "destructive"
      });
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
      toast({
        title: "Erro",
        description: "Nenhuma demanda selecionada para resposta.",
        variant: "destructive"
      });
      return;
    }
    
    if (Object.keys(resposta).length === 0) {
      console.error("Nenhuma resposta fornecida");
      toast({
        title: "Erro",
        description: "Por favor, forneça respostas para todas as perguntas.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar se todas as perguntas foram respondidas
    const hasEmptyAnswers = Object.values(resposta).some(r => !r || r.trim() === '');
    if (hasEmptyAnswers) {
      console.error("Algumas respostas estão vazias");
      toast({
        title: "Validação",
        description: "Por favor, responda a todas as perguntas antes de enviar.",
        variant: "destructive"
      });
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
