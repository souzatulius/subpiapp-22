
// This is a placeholder file since the services table has been removed
// Any imports of this file will be redirected to this stub implementation
export function useServices() {
  return {
    services: [],
    areas: [],
    loading: false,
    isSubmitting: false,
    addService: async () => false,
    updateService: async () => false,
    deleteService: async () => false
  };
}

export const serviceSchema = {
  // Placeholder schema since services have been removed
  shape: {}
};

export type Service = {
  id: string;
  descricao: string;
  supervisao_tecnica_id?: string;
};

export type Area = {
  id: string;
  descricao: string;
};
