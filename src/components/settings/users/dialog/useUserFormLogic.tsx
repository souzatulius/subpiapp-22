
import React from 'react';
import { User, Area } from '../types';

export const useUserFormLogic = (areas: Area[]) => {
  // Handle coordination and area filtering
  const filterAreasByCoordination = (coordenacao: string) => {
    if (!coordenacao || coordenacao === 'select-coordenacao') return [];
    
    const filtered = areas.filter(a => a.coordenacao_id === coordenacao);
    console.log(`Filtered ${filtered.length} supervisions for coordination ${coordenacao}`);
    return filtered;
  };
  
  return {
    filterAreasByCoordination
  };
};

export default useUserFormLogic;
