
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
  const [resposta, setResposta] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitResposta = async () => {
    if (!selectedDemanda || !resposta.trim()) {
      toast({
        title: "Resposta não pode ser vazia",
        description: "Por favor, digite uma resposta para a demanda.",
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

      // Then create the response
      const { error: respostaError } = await supabase
        .from('respostas_demandas')
        .insert([{
          demanda_id: selectedDemanda.id,
          usuario_id: user?.id,
          texto: resposta
        }]);
        
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
      setResposta('');
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
    isLoading,
    handleSubmitResposta
  };
};
