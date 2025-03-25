
import { useAreas } from './data/useAreas';
import { useServices } from './data/useServices';

export function useServicesData() {
  const { areas, loading: areasLoading } = useAreas();
  const { services, setServices, loading: servicesLoading, fetchServices } = useServices();
  
  const loading = areasLoading || servicesLoading;

  return {
    services,
    setServices,
    areas,
    loading,
    fetchServices
  };
}
