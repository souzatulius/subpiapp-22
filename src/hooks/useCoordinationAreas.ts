
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
      // Adding headers to bypass RLS for this specific operation
      const { error } = await supabase
        .from('areas_coordenacao')
        .insert({
          descricao: data.descricao,
        })
        .select();
      
      if (error) {
        console.error('Detailed error:', error);
        throw error;
      }
      
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
      const { error } = await supabase
        .from('areas_coordenacao')
        .update({
          descricao: data.descricao,
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
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
      // Check if there are dependent records
      const { count: usersCount, error: usersError } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('area_coordenacao_id', area.id);
        
      if (usersError) throw usersError;
        
      const { count: servicesCount, error: servicesError } = await supabase
        .from('servicos')
        .select('*', { count: 'exact', head: true })
        .eq('area_coordenacao_id', area.id);
        
      if (servicesError) throw servicesError;
        
      if ((usersCount || 0) > 0 || (servicesCount || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem usuários ou serviços associados a esta área',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('areas_coordenacao')
        .delete()
        .eq('id', area.id);
      
      if (error) throw error;
      
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
