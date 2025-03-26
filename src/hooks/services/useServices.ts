
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Service } from './types';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchServices = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Fetching services...');
      const { data, error } = await supabase
        .from('servicos')
        .select(`
          *,
          supervisao_tecnica:supervisao_tecnica_id (
            id,
            descricao,
            coordenacao_id
          )
        `)
        .order('descricao');

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      console.log('Services fetched:', data);
      setServices(data || []);
    } catch (error) {
      console.error('Error in fetchServices:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addService = async (service: Omit<Service, 'id' | 'criado_em'>) => {
    if (!user) return;

    try {
      console.log('Adding service:', service);
      const { data, error } = await supabase
        .from('servicos')
        .insert(service)
        .select()
        .single();

      if (error) throw error;

      console.log('Service added:', data);
      setServices(prev => [...prev, data]);
      
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

  const updateService = async (serviceId: string, updates: Partial<Service>) => {
    if (!user) return;

    try {
      console.log('Updating service:', serviceId, updates);
      const { data, error } = await supabase
        .from('servicos')
        .update(updates)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;

      console.log('Service updated:', data);
      setServices(prev => prev.map(service => 
        service.id === serviceId ? data : service
      ));
      
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o serviço.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!user) return;

    try {
      console.log('Deleting service:', serviceId);
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
