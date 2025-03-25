
import { useEffect } from 'react';
import { useCoordinationAreasData } from './useCoordinationAreasData';
import { useCoordinationAreasCrud } from './useCoordinationAreasCrud';
import { Area, areaSchema } from './types';
import { Coordination } from '@/hooks/settings/useCoordination';

// Export types using the 'export type' syntax to fix the TS1205 error
export type { Area };
export { areaSchema };

export const useCoordinationAreas = () => {
  const {
    areas,
    coordinations,
    isLoading,
    fetchAreas,
    fetchCoordinations,
    setAreas
  } = useCoordinationAreasData();

  const {
    isAdding,
    isEditing,
    isDeleting,
    isSubmitting,
    addArea,
    updateArea,
    deleteArea
  } = useCoordinationAreasCrud(areas, setAreas);

  useEffect(() => {
    fetchAreas();
    fetchCoordinations();
  }, [fetchAreas, fetchCoordinations]);

  return {
    // Data
    areas,
    coordinations,
    
    // Loading states
    isLoading,
    isAdding,
    isEditing,
    isDeleting,
    isSubmitting,
    
    // Alias for compatibility with existing code
    loading: isLoading,
    
    // Functions
    fetchAreas,
    fetchCoordinations,
    addArea,
    updateArea,
    deleteArea,
  };
};
