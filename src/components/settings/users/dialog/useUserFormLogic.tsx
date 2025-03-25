
import React from 'react';
import { User, Area } from '../types';

export const useUserFormLogic = (areas: Area[]) => {
  // Handle coordination and area filtering
  const filterAreasByCoordination = (coordenacao: string) => {
    if (!coordenacao || coordenacao === 'select-coordenacao') return [];
    return areas.filter(a => a.coordenacao_id === coordenacao);
  };
  
  return {
    filterAreasByCoordination
  };
};

export default useUserFormLogic;
