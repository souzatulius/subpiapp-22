
import { useAddService } from './operations/useAddService';
import { useUpdateService } from './operations/useUpdateService';
import { useDeleteService } from './operations/useDeleteService';

export const useServiceOperations = (refreshCallback: () => Promise<void>) => {
  const { isAdding, addService: addServiceBase } = useAddService();
  const { isEditing, updateService: updateServiceBase } = useUpdateService();
  const { isDeleting, deleteService: deleteServiceBase } = useDeleteService();

  // Wrap the base operations to include the refresh callback
  const addService = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    const result = await addServiceBase(data);
    if (result) {
      await refreshCallback();
    }
    return result;
  };

  const updateService = async (id: string, data: { descricao: string; supervisao_tecnica_id: string }) => {
    const result = await updateServiceBase(id, data);
    if (result) {
      await refreshCallback();
    }
    return result;
  };

  const deleteService = async (id: string) => {
    const result = await deleteServiceBase(id);
    if (result) {
      await refreshCallback();
    }
    return result;
  };

  return {
    isSubmitting: isAdding || isEditing,
    isDeleting,
    addService,
    updateService,
    deleteService
  };
};
