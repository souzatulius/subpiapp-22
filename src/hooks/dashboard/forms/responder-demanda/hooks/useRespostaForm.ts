
import { useState } from 'react';
import { Demanda } from '@/components/dashboard/forms/responder-demanda/types';
import { useRespostaSubmission } from '@/components/dashboard/forms/responder-demanda/hooks/useRespostaSubmission';
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
  
  const { isSubmitting, submitResposta } = useRespostaSubmission({
    onSuccess: () => {
      // Update local state to remove the answered demand
      if (selectedDemanda) {
        console.log("Resposta enviada com sucesso. Atualizando listas locais.");
        setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
        setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
        setSelectedDemanda(null);
        setResposta({});
        setComentarios('');
        
        // A mensagem de sucesso já é exibida no hook useRespostaSubmission,
        // então removemos daqui para evitar duplicação
      }
    },
    onError: (error) => {
      console.error("Erro ao enviar resposta:", error);
      // Mantemos este toast para casos específicos de erro
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

    // Não exibimos toast aqui, pois já é exibido no submitResposta
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
