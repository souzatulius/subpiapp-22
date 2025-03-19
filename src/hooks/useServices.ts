
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

export const serviceSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  area_coordenacao_id: z.string().min(1, 'Selecione uma área de coordenação'),
});

export type Area = {
  id: string;
  descricao: string;
  criado_em: string;
};

export type Service = {
  id: string;
  descricao: string;
  area_coordenacao_id: string;
  areas_coordenacao?: {
    id: string;
    descricao: string;
    criado_em?: string;
  };
  criado_em: string;
};

export function useServices() {
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
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar áreas:', error);
      setAreas([]);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select(`
          *,
          areas_coordenacao(id, descricao)
        `)
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our Service type
      const transformedData: Service[] = (data || []).map((item: any) => ({
        ...item,
        areas_coordenacao: item.areas_coordenacao
      }));
      
      setServices(transformedData);
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

  const addService = async (data: { descricao: string; area_coordenacao_id: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Adicionando serviço:', data);
      
      const { data: result, error } = await supabase.rpc('insert_servico', {
        p_descricao: data.descricao,
        p_area_coordenacao_id: data.area_coordenacao_id
      });
      
      if (error) throw error;
      
      console.log('Serviço adicionado com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Serviço adicionado com sucesso',
      });
      
      await fetchServices();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar serviço:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o serviço',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateService = async (id: string, data: { descricao: string; area_coordenacao_id: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Atualizando serviço:', id, data);
      
      const { data: result, error } = await supabase.rpc('update_servico', {
        p_id: id,
        p_descricao: data.descricao,
        p_area_coordenacao_id: data.area_coordenacao_id
      });
      
      if (error) throw error;
      
      console.log('Serviço atualizado com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Serviço atualizado com sucesso',
      });
      
      await fetchServices();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar serviço:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o serviço',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteService = async (service: Service) => {
    try {
      console.log('Excluindo serviço:', service.id);
      
      // Verificar se há demandas associadas a este serviço
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('servico_id', service.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a este serviço',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase.rpc('delete_servico', {
        p_id: service.id
      });
      
      if (error) throw error;
      
      toast({
        title: 'Serviço excluído',
        description: 'O serviço foi excluído com sucesso',
      });
      
      await fetchServices();
    } catch (error: any) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o serviço',
        variant: 'destructive',
      });
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
}
