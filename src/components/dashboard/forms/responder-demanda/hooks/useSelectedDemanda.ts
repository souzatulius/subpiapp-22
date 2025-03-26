
import { useState } from 'react';
import { Demanda } from '../types';

export const useSelectedDemanda = () => {
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);

  const handleSelectDemanda = (demanda: Demanda) => {
    setSelectedDemanda(demanda);
  };

  return {
    selectedDemanda,
    setSelectedDemanda,
    handleSelectDemanda
  };
};
