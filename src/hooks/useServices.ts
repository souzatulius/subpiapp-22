
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

export const serviceSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  area_coordenacao_id: z.string().min(1, 'Selecione uma área de coordenação'),
});

export type Service = {
  id: string;
  descricao: string;
  area_coordenacao_id: string;
  areas_coordenacao: {
    id: string;
    descricao: string;
  };
  criado_em: string;
};

export type Area = {
  id: string;
  descricao: string;
};

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('servicos')
        .select(`
          *,
          areas_coordenacao(id, descricao)
        `)
        .order('descricao', { ascending: true });
      
      if (servicesError) throw servicesError;
      
      // Fetch areas
      const { data: areasData, error: areasError } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (areasError) throw areasError;
      
      setServices(servicesData || []);
      setAreas(areasData || []);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addService = async (data: z.infer<typeof serviceSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .insert({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Serviço adicionado com sucesso',
      });
      
      await fetchData();
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

  const updateService = async (id: string, data: z.infer<typeof serviceSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .update({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Serviço atualizado com sucesso',
      });
      
      await fetchData();
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
      // Check if there are dependent records
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
      
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', service.id);
      
      if (error) throw error;
      
      toast({
        title: 'Serviço excluído',
        description: 'O serviço foi excluído com sucesso',
      });
      
      await fetchData();
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
    fetchData,
    addService,
    updateService,
    deleteService
  };
}
