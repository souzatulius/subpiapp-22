
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
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
  const [resposta, setResposta] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [comentarios, setComentarios] = useState<string>('');

  const handleSubmitResposta = async () => {
    if (!selectedDemanda || Object.keys(resposta).length === 0) {
      toast({
        title: "Resposta não pode ser vazia",
        description: "Por favor, responda todas as perguntas da demanda.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);

      // Update the demand status to "in progress"
      const { error: updateError } = await supabase
        .from('demandas')
        .update({
          status: 'em_andamento'  // Update status to show it's being processed
        })
        .eq('id', selectedDemanda.id);
        
      if (updateError) throw updateError;

      // Generate a text summary of responses
      const respostasText = Object.entries(resposta)
        .map(([key, value]) => {
          const perguntaText = Array.isArray(selectedDemanda.perguntas) 
            ? selectedDemanda.perguntas[parseInt(key)]
            : selectedDemanda.perguntas?.[key] || '';
          return `Pergunta: ${perguntaText}\nResposta: ${value}`;
        })
        .join('\n\n');

      // Then create the response with text, JSON format, and comments
      const { error: respostaError } = await supabase
        .from('respostas_demandas')
        .insert({
          demanda_id: selectedDemanda.id,
          usuario_id: user?.id,
          respostas: resposta,
          texto: respostasText,
          comentarios: comentarios || null
        });
        
      if (respostaError) throw respostaError;

      // Finally update status to responded
      const { error: statusError } = await supabase
        .from('demandas')
        .update({
          status: 'respondida'
        })
        .eq('id', selectedDemanda.id);
        
      if (statusError) throw statusError;
      
      toast({
        title: "Resposta enviada com sucesso!",
        description: "A demanda foi respondida e seu status foi atualizado."
      });

      // Update local state
      setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
      setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
      setSelectedDemanda(null);
      setResposta({});
      setComentarios('');
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      toast({
        title: "Erro ao enviar resposta",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resposta,
    setResposta,
    comentarios,
    setComentarios,
    isLoading,
    handleSubmitResposta
  };
};
