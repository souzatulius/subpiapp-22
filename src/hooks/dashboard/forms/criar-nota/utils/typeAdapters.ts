
import { Demand } from '@/components/dashboard/forms/criar-nota/types';

/**
 * Adapts the Demand type from component to the expected type in the API.
 * Ensures all required fields are properly formatted.
 */
export const adaptDemandType = (selectedDemanda: Demand): any => {
  // Create a clean copy
  return {
    id: selectedDemanda.id,
    titulo: selectedDemanda.titulo,
    problema_id: selectedDemanda.problema_id || null,
    coordenacao_id: selectedDemanda.coordenacao_id || null,
    supervisao_tecnica_id: selectedDemanda.supervisao_tecnica_id || null,
    // Fix: Access the bairro object and extract the id if it exists
    bairro_id: selectedDemanda.bairro?.id || null,
    area_coordenacao: selectedDemanda.area_coordenacao || null,
    supervisao_tecnica: selectedDemanda.supervisao_tecnica || null,
    bairro: selectedDemanda.bairro || null,
    status: selectedDemanda.status || 'pendente'
  };
};
