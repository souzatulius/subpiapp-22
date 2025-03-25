
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

export const areaSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "A descrição é obrigatória e deve ter pelo menos 3 caracteres")
});

export interface Area {
  id: string;
  descricao: string;
}

export const useCoordinationAreas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao')
        .order('descricao');
      
      if (error) throw error;
      
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching coordination areas:', error);
      toast({
        title: "Erro ao carregar áreas",
        description: "Não foi possível carregar as áreas de coordenação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createArea = async (area: Omit<Area, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .insert(area)
        .select();
      
      if (error) throw error;
      
      setAreas(prev => [...prev, data[0] as Area]);
      
      toast({
        title: "Área criada",
        description: "A área de coordenação foi criada com sucesso.",
      });
      
      return data[0];
    } catch (error) {
      console.error('Error creating area:', error);
      toast({
        title: "Erro ao criar área",
        description: "Não foi possível criar a área de coordenação.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateArea = async (id: string, area: Omit<Area, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .update(area)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setAreas(prev => prev.map(a => a.id === id ? { ...a, ...area } : a));
      
      toast({
        title: "Área atualizada",
        description: "A área de coordenação foi atualizada com sucesso.",
      });
      
      return data[0];
    } catch (error) {
      console.error('Error updating area:', error);
      toast({
        title: "Erro ao atualizar área",
        description: "Não foi possível atualizar a área de coordenação.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteArea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('areas_coordenacao')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAreas(prev => prev.filter(a => a.id !== id));
      
      toast({
        title: "Área removida",
        description: "A área de coordenação foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting area:', error);
      toast({
        title: "Erro ao remover área",
        description: "Não foi possível remover a área de coordenação. Verifique se não existem registros associados a ela.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return {
    areas,
    isLoading,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea
  };
};
