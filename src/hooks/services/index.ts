
import { useServicesData } from './useServicesData';
import { useServiceOperations } from './useServiceOperations';
import { Service, Area, serviceSchema } from './types';

export function useServices() {
  const { services, areas, loading, fetchServices } = useServicesData();
  const { isSubmitting, addService, updateService, deleteService } = useServiceOperations(fetchServices);

  return {
    services,
    areas,
    loading,
    isSubmitting,
    addService,
    updateService,
    deleteService
  };
}

export { serviceSchema };
export type { Service, Area };
