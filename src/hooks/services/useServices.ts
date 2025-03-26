
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';

export interface Service {
  id?: string;
  descricao: string;
  supervisao_tecnica_id: string;
  criado_em?: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchServices = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*, supervisao_tecnica:areas_coordenacao(descricao)');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addService = async (service: Omit<Service, 'id' | 'criado_em'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert(service)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => [...prev, data]);
      toast({
        title: 'Serviço adicionado',
        description: 'O serviço foi cadastrado com sucesso.',
      });
      
      return data;
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o serviço.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setServices(prev => prev.filter(service => service.id !== serviceId));
      toast({
        title: 'Serviço removido',
        description: 'O serviço foi excluído com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o serviço.',
        variant: 'destructive'
      });
    }
  };

  return {
    services,
    loading,
    fetchServices,
    addService,
    deleteService
  };
};
