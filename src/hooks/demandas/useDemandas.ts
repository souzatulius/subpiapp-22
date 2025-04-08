
import { useState } from 'react';
import { Demand } from '@/hooks/consultar-demandas/types';
import { useRespostaSubmission } from '@/components/dashboard/forms/responder-demanda/hooks/useRespostaSubmission';
import { toast } from '@/components/ui/use-toast';
import { normalizeQuestions } from '@/utils/questionFormatUtils';

export const useDemandas = () => {
  // Hook to handle responding to demands in the ConsultarDemandas page
  const useRespostaDemanda = (selectedDemand: Demand | null) => {
    const [resposta, setResposta] = useState<Record<string, string>>({});
    const [comentarios, setComentarios] = useState<string>('');
    
    const { isSubmitting, submitResposta } = useRespostaSubmission({
      onSuccess: () => {
        toast({
          title: "Resposta enviada com sucesso",
          description: "A demanda foi respondida e está em processamento.",
        });
        setResposta({});
        setComentarios('');
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
        [key]: value,
      }));
    };

    const handleSubmitResposta = async (): Promise<void> => {
      if (!selectedDemand) {
        toast({
          title: "Erro",
          description: "Nenhuma demanda selecionada para resposta.",
          variant: "destructive"
        });
        return;
      }
      
      if (Object.keys(resposta).length === 0) {
        toast({
          title: "Erro",
          description: "Por favor, forneça respostas para todas as perguntas.",
          variant: "destructive"
        });
        return;
      }
      
      // Verificar se todas as perguntas foram respondidas
      const normalizedQuestions = normalizeQuestions(selectedDemand.perguntas || {});
      const hasEmptyAnswers = normalizedQuestions.some((_, index) => {
        const respostaAtual = resposta[index.toString()];
        return !respostaAtual || respostaAtual.trim() === '';
      });
      
      if (hasEmptyAnswers) {
        toast({
          title: "Validação",
          description: "Por favor, responda a todas as perguntas antes de enviar.",
          variant: "destructive"
        });
        return;
      }
      
      await submitResposta(selectedDemand as any, resposta, comentarios);
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

  return {
    useRespostaDemanda
  };
};
