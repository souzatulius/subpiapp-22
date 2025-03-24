
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Demanda } from '../types';

export const useRespostaForm = (
  selectedDemanda: Demanda | null,
  setSelectedDemanda: (demanda: Demanda | null) => void,
  demandas: Demanda[],
  setDemandas: (demandas: Demanda[]) => void,
  filteredDemandas: Demanda[],
  setFilteredDemandas: (demandas: Demanda[]) => void
) => {
  const { user } = useAuth();
  const [resposta, setResposta] = useState('');
  const [respostasPerguntas, setRespostasPerguntas] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRespostaPerguntaChange = (perguntaIndex: string, value: string) => {
    setRespostasPerguntas(prev => ({
      ...prev,
      [perguntaIndex]: value
    }));
  };

  const handleSubmitResposta = async () => {
    if (!selectedDemanda) {
      toast.error("Demanda não selecionada", {
        description: "Por favor, selecione uma demanda para responder."
      });
      return;
    }

    // Check if at least one question has been answered
    const hasAnsweredAnyQuestion = Object.values(respostasPerguntas).some(answer => answer.trim() !== '');
    
    if (!hasAnsweredAnyQuestion && !resposta.trim()) {
      toast.error("Resposta não pode ser vazia", {
        description: "Por favor, responda pelo menos uma pergunta ou adicione observações."
      });
      return;
    }

    try {
      setIsLoading(true);

      // Prepare the response data
      const responseData = {
        demanda_id: selectedDemanda.id,
        usuario_id: user?.id,
        texto: resposta.trim() ? resposta : "Respostas às perguntas fornecidas.",
        respostas: respostasPerguntas
      };

      const {
        error: respostaError
      } = await supabase.from('respostas_demandas').insert([responseData]);
      
      if (respostaError) throw respostaError;

      const {
        error: statusError
      } = await supabase.from('demandas').update({
        status: 'respondida'
      }).eq('id', selectedDemanda.id);
      
      if (statusError) throw statusError;
      
      toast.success("Resposta enviada com sucesso!", {
        description: "A demanda foi respondida e seu status foi atualizado."
      });

      setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
      setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
      setSelectedDemanda(null);
      setResposta('');
      setRespostasPerguntas({});
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      toast.error("Erro ao enviar resposta", {
        description: error.message || "Ocorreu um erro ao processar sua solicitação."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resposta,
    setResposta,
    respostasPerguntas,
    handleRespostaPerguntaChange,
    isLoading,
    handleSubmitResposta
  };
};
