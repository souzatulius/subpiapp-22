
import React from 'react';
import { User, SupervisaoTecnica } from '../types';

export const useUserFormLogic = (supervisoesTecnicas: SupervisaoTecnica[]) => {
  // Handle coordination and supervision filtering
  const filterSupervisoesByCoordination = (coordenacaoId: string) => {
    if (!coordenacaoId || coordenacaoId === 'select-coordenacao') return [];
    
    const filtered = supervisoesTecnicas.filter(s => s.coordenacao_id === coordenacaoId);
    console.log(`Filtered ${filtered.length} supervisions for coordination ${coordenacaoId}`);
    return filtered;
  };
  
  return {
    filterSupervisoesByCoordination
  };
};

export default useUserFormLogic;
