
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Service } from './types';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('servicos')
        .select(`
          *,
          problema:problema_id (
            id,
            descricao
          )
        `)
        .order('descricao');
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Erro ao carregar serviços',
        description: error.message || 'Não foi possível carregar os serviços.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const addService = async (serviceData: { descricao: string; problema_id: string }) => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert(serviceData)
        .select();
      
      if (error) throw error;
      
      await fetchServices();
      
      return data[0];
    } catch (error: any) {
      console.error('Error adding service:', error);
      toast({
        title: 'Erro ao adicionar serviço',
        description: error.message || 'Não foi possível adicionar o serviço.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateService = async (id: string, serviceData: { descricao: string; problema_id: string }) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .update(serviceData)
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchServices();
      
      return true;
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        title: 'Erro ao atualizar serviço',
        description: error.message || 'Não foi possível atualizar o serviço.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Serviço excluído',
        description: 'O serviço foi excluído com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Erro ao excluir serviço',
        description: error.message || 'Não foi possível excluir o serviço.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    services,
    loading,
    fetchServices,
    addService,
    updateService,
    deleteService
  };
};
