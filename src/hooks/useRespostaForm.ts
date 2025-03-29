
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { Demanda } from '@/components/dashboard/forms/responder-demanda/types';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleRespostaChange = (key: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

      // Generate a text summary of responses
      const respostasText = Object.entries(resposta)
        .map(([key, value]) => {
          const perguntaText = Array.isArray(selectedDemanda.perguntas) 
            ? selectedDemanda.perguntas[parseInt(key)]
            : selectedDemanda.perguntas?.[key] || '';
          return `Pergunta: ${perguntaText}\nResposta: ${value}`;
        })
        .join('\n\n');

      // Create the response with both text and JSON format
      const { error: respostaError } = await supabase
        .from('respostas_demandas')
        .insert({
          demanda_id: selectedDemanda.id,
          usuario_id: user?.id,
          respostas: resposta,
          texto: respostasText, // Add required texto field
          comentarios: comentarios || null
        });
        
      if (respostaError) throw respostaError;

      // Try to update status to em_andamento, but don't fail if it doesn't work
      try {
        await supabase
          .from('demandas')
          .update({ status: 'em_andamento' })
          .eq('id', selectedDemanda.id);
      } catch (error) {
        console.warn("Could not update status, but response was saved", error);
        // Continue anyway since the response was saved
      }
      
      toast({
        title: "Resposta enviada com sucesso!",
        description: "A demanda foi respondida."
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
    handleSubmitResposta,
    handleRespostaChange
  };
};
