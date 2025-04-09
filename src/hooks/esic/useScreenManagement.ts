
import { useState } from 'react';
import { ScreenState } from './types';
import { ESICProcesso } from '@/types/esic';

export const useScreenManagement = () => {
  const [screen, setScreen] = useState<ScreenState>('list');
  const [selectedProcesso, setSelectedProcesso] = useState<ESICProcesso | null>(null);

  const handleViewProcesso = (processo: ESICProcesso) => {
    setSelectedProcesso(processo);
    setScreen('view');
  };

  const handleEditProcesso = (processo: ESICProcesso) => {
    setSelectedProcesso(processo);
    setScreen('edit');
  };

  const handleAddJustificativa = () => {
    setScreen('justify');
  };

  return {
    screen,
    setScreen,
    selectedProcesso,
    setSelectedProcesso,
    handleViewProcesso,
    handleEditProcesso,
    handleAddJustificativa
  };
};
