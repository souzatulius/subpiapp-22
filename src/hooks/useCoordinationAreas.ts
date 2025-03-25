
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

export const areaSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

export type Area = {
  id: string;
  descricao: string;
  criado_em: string;
};

export function useCoordinationAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar áreas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as áreas de coordenação',
        variant: 'destructive',
      });
      // Ensure areas is always an array even in case of error
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  const addArea = async (data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Attempting to add area:', data);
      
      // Use a function call which has SECURITY DEFINER to bypass RLS
      const { data: result, error } = await supabase.rpc('insert_area_coordenacao', {
        p_descricao: data.descricao
      });
      
      if (error) {
        console.error('Detailed error when adding area:', error);
        throw error;
      }
      
      console.log('Area added successfully:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Área de coordenação adicionada com sucesso',
      });
      
      await fetchAreas();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar área:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar a área',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateArea = async (id: string, data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Attempting to update area:', id, data);
      
      // Use a function call which has SECURITY DEFINER to bypass RLS
      const { data: result, error } = await supabase.rpc('update_area_coordenacao', {
        p_id: id,
        p_descricao: data.descricao
      });
      
      if (error) {
        console.error('Detailed error when updating area:', error);
        throw error;
      }
      
      console.log('Area updated successfully:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Área de coordenação atualizada com sucesso',
      });
      
      await fetchAreas();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar área:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar a área',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteArea = async (area: Area) => {
    try {
      console.log('Attempting to delete area:', area.id);
      
      // Check if there are dependent records
      const { count: usersCount, error: usersError } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('area_coordenacao_id', area.id);
        
      if (usersError) {
        console.error('Error checking users:', usersError);
        throw usersError;
      }
        
      const { count: servicesCount, error: servicesError } = await supabase
        .from('servicos')
        .select('*', { count: 'exact', head: true })
        .eq('area_coordenacao_id', area.id);
        
      if (servicesError) {
        console.error('Error checking services:', servicesError);
        throw servicesError;
      }
        
      if ((usersCount || 0) > 0 || (servicesCount || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem usuários ou serviços associados a esta área',
          variant: 'destructive',
        });
        return;
      }
      
      // Use a function call which has SECURITY DEFINER to bypass RLS
      const { error } = await supabase.rpc('delete_area_coordenacao', {
        p_id: area.id
      });
      
      if (error) {
        console.error('Error deleting area:', error);
        throw error;
      }
      
      console.log('Area deleted successfully');
      
      toast({
        title: 'Área excluída',
        description: 'A área de coordenação foi excluída com sucesso',
      });
      
      await fetchAreas();
    } catch (error: any) {
      console.error('Erro ao excluir área:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir a área',
        variant: 'destructive',
      });
    }
  };

  return {
    areas,
    loading,
    isSubmitting,
    fetchAreas,
    addArea,
    updateArea,
    deleteArea
  };
}
