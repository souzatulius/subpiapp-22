
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Area {
  id: string;
  descricao: string;
}

export interface Service {
  id: string;
  descricao: string;
  area_coordenacao_id: string;
  criado_em: string;
  areas_coordenacao?: {
    id: string;
    descricao: string;
  };
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao');

      if (error) throw error;
      if (data) setAreas(data as Area[]);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as áreas de coordenação.",
        variant: "destructive",
      });
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select(`
          *,
          areas_coordenacao:area_coordenacao_id (
            id,
            descricao
          )
        `)
        .order('descricao');

      if (error) throw error;
      if (data) setServices(data as Service[]);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addService = async (data: { descricao: string; area_coordenacao_id: string }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .insert([data]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Serviço adicionado com sucesso.",
      });
      
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o serviço.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateService = async (id: string, data: { descricao: string; area_coordenacao_id: string }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso.",
      });
      
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
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
        title: "Sucesso",
        description: "Serviço removido com sucesso.",
      });
      
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o serviço.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    services,
    areas,
    loading,
    isSubmitting,
    addService,
    updateService,
    deleteService
  };
};
