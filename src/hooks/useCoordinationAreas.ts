
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Area {
  id: string;
  descricao: string;
  criado_em: string;
}

export const useCoordinationAreas = () => {
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
    } finally {
      setLoading(false);
    }
  };

  const addArea = async (data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Adding area with data:', data);
      const { error, data: responseData } = await supabase
        .from('areas_coordenacao')
        .insert([data])
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error response:', error);
        throw error;
      }
      
      console.log('Area added successfully:', responseData);
      toast({
        title: "Sucesso",
        description: "Área de coordenação adicionada com sucesso.",
      });
      
      await fetchAreas();
      return true;
    } catch (error) {
      console.error('Error adding area:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a área de coordenação.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateArea = async (id: string, data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('areas_coordenacao')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Área de coordenação atualizada com sucesso.",
      });
      
      await fetchAreas();
      return true;
    } catch (error) {
      console.error('Error updating area:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a área de coordenação.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteArea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('areas_coordenacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Área de coordenação removida com sucesso.",
      });
      
      await fetchAreas();
      return true;
    } catch (error) {
      console.error('Error deleting area:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a área de coordenação.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    areas,
    loading,
    isSubmitting,
    addArea,
    updateArea,
    deleteArea
  };
};
