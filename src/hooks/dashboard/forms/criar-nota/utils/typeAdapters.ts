
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
    // Fix: Handle the bairro object which might have different structures
    // Check if bairro has an id property before accessing it
    bairro_id: selectedDemanda.bairro && typeof selectedDemanda.bairro === 'object' && 'id' in selectedDemanda.bairro ? 
              (selectedDemanda.bairro.id || null) : 
              (selectedDemanda.bairro_id || null),
    area_coordenacao: selectedDemanda.area_coordenacao || null,
    // Fix: Using supervisao_tecnica_id instead of supervisao_tecnica
    status: selectedDemanda.status || 'pendente'
  };
};
