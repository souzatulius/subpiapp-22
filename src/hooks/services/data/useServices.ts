
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Service } from '../types';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      console.log('Services functionality has been removed');
      setServices([]);
    } catch (error: any) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços',
        variant: 'destructive',
      });
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    setServices,
    loading,
    fetchServices
  };
}
