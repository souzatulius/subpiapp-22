
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
  
  const { isSubmitting, submitResposta } = useRespostaSubmission({
    onSuccess: () => {
      // Update local state to remove the answered demand
      if (selectedDemanda) {
        setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
        setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
        setSelectedDemanda(null);
        setResposta({});
        setComentarios('');
      }
    }
  });

  const handleSubmitResposta = async (): Promise<void> => {
    // We'll ignore the return value here, as we're using the callbacks
    // to handle success/failure states
    await submitResposta(selectedDemanda, resposta, comentarios);
  };

  return {
    resposta,
    setResposta,
    comentarios,
    setComentarios,
    isLoading: isSubmitting,
    handleSubmitResposta
  };
};
