
import { useState, useCallback } from 'react';
import { Demanda } from '../types';

export const useSelectedDemanda = () => {
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);

  const handleSelectDemanda = useCallback((demanda: Demanda) => {
    setSelectedDemanda(demanda);
  }, []);

  return {
    selectedDemanda,
    setSelectedDemanda,
    handleSelectDemanda,
  };
};
