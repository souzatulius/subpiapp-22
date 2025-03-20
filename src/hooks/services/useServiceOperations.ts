
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Service } from './types';

export function useServiceOperations(fetchServices: () => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    isSubmitting,
    addService,
    updateService,
    deleteService
  };
}
