
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Service } from './types';

export const useServices = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  const { data, error, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      setIsLoading(true);
      try {
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
        return data || [];
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast({
          title: 'Erro ao carregar serviços',
          description: error.message || 'Não foi possível carregar os serviços.',
          variant: 'destructive'
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Set services when data changes
  useEffect(() => {
    if (data) {
      setServices(data);
    }
  }, [data]);

  const addService = async (serviceData: { descricao: string; problema_id: string }) => {
    try {
      // Adding supervisao_tecnica_id as null to satisfy database requirements
      const dataToInsert = {
        descricao: serviceData.descricao,
        problema_id: serviceData.problema_id,
        supervisao_tecnica_id: null  // This ensures it matches the database schema expectation
      };
      
      const { data, error } = await supabase
        .from('servicos')
        .insert(dataToInsert)
        .select();
      
      if (error) throw error;
      
      await refetch();
      
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
      // Adding supervisao_tecnica_id as null to satisfy database requirements
      const dataToUpdate = {
        descricao: serviceData.descricao,
        problema_id: serviceData.problema_id,
        supervisao_tecnica_id: null  // This ensures it matches the database schema expectation
      };
      
      const { error } = await supabase
        .from('servicos')
        .update(dataToUpdate)
        .eq('id', id);
      
      if (error) throw error;
      
      await refetch();
      
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
      
      await refetch();
      
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
    isLoading,
    error,
    fetchServices: refetch,
    addService,
    updateService,
    deleteService
  };
};
