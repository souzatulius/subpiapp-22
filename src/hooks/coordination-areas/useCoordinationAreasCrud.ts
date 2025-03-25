
import { CoordinationArea } from './types';
import { useAddArea } from './operations/useAddArea';
import { useUpdateArea } from './operations/useUpdateArea';
import { useDeleteArea } from './operations/useDeleteArea';

export const useCoordinationAreasCrud = (
  areas: CoordinationArea[],
  setAreas: React.Dispatch<React.SetStateAction<CoordinationArea[]>>
) => {
  const { isAdding, addArea } = useAddArea(areas, setAreas);
  const { isEditing, updateArea } = useUpdateArea(areas, setAreas);
  const { isDeleting, deleteArea } = useDeleteArea(areas, setAreas);

  return {
    isAdding,
    isEditing,
    isDeleting,
    isSubmitting: isAdding || isEditing,
    addArea,
    updateArea,
    deleteArea
  };
};
