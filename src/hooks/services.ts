
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

export const serviceSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "A descrição é obrigatória e deve ter pelo menos 3 caracteres"),
  problema_id: z.string().min(1, "O problema é obrigatório"),
  area_coordenacao_id: z.string().min(1, "A área de coordenação é obrigatória")
});

export type Service = {
  id: string;
  descricao: string;
  problema_id: string;
  area_coordenacao_id: string;
  criado_em?: string;
};

export type Area = {
  id: string;
  descricao: string;
};

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      
      // Fetch services with problem information
      const { data: servicesData, error } = await supabase
        .from('servicos')
        .select(`
          id,
          descricao,
          problema_id,
          criado_em,
          problemas(descricao)
        `)
        .order('descricao');

      if (error) throw error;

      // Fetch areas
      const { data: areasData, error: areasError } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao')
        .order('descricao');
      
      if (areasError) throw areasError;

      // Transform the data to match the Service interface
      const transformedServices = servicesData.map(service => ({
        id: service.id,
        descricao: service.descricao,
        problema_id: service.problema_id,
        problema_descricao: service.problemas?.descricao || 'Desconhecido',
        area_coordenacao_id: '', // Default value, will be updated if relationship is established
        criado_em: service.criado_em
      }));

      setServices(transformedServices as Service[]);
      setAreas(areasData || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createService = async (service: Omit<Service, 'id' | 'criado_em'>) => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert({
          descricao: service.descricao,
          problema_id: service.problema_id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add the new service to the state
      setServices(prev => [
        ...prev,
        {
          ...data,
          area_coordenacao_id: service.area_coordenacao_id,
        } as Service
      ]);
      
      return data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  };

  const updateService = async (id: string, service: Partial<Omit<Service, 'id' | 'criado_em'>>) => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .update({
          descricao: service.descricao,
          problema_id: service.problema_id,
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      // Update the service in the state
      setServices(prev => 
        prev.map(s => s.id === id ? { 
          ...s, 
          ...service, 
          ...data?.[0]
        } as Service : s)
      );
      
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
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
      
      // Remove the service from the state
      setServices(prev => prev.filter(s => s.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    areas,
    isLoading,
    fetchServices,
    createService,
    updateService,
    deleteService
  };
};
