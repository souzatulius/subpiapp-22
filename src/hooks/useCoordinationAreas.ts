
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

// Define tipos para evitar recursividade infinita
export type CoordinationArea = {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao?: string;
  criado_em?: string;
};

// Alias para compatibilidade com código existente
export type Area = CoordinationArea;

// Schema para validação de formulários
export const areaSchema = z.object({
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  sigla: z.string().optional(),
  coordenacao: z.string().optional()
});

export const useCoordinationAreas = () => {
  const [areas, setAreas] = useState<CoordinationArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAreas = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao');

      if (error) throw error;
      
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar supervisões técnicas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as supervisões técnicas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const addArea = async (data: { descricao: string, sigla?: string, coordenacao?: string }) => {
    try {
      setIsAdding(true);
      const { data: newArea, error } = await supabase
        .from('areas_coordenacao')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      
      setAreas([...areas, newArea]);
      toast({
        title: "Supervisão técnica adicionada",
        description: "Supervisão técnica adicionada com sucesso.",
      });
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar supervisão técnica:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a supervisão técnica.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const updateArea = async (id: string, data: { descricao: string, sigla?: string, coordenacao?: string }) => {
    try {
      setIsEditing(true);
      const { error } = await supabase
        .from('areas_coordenacao')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      setAreas(areas.map(area => 
        area.id === id ? { ...area, ...data } : area
      ));
      
      toast({
        title: "Supervisão técnica atualizada",
        description: "Supervisão técnica atualizada com sucesso.",
      });
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar supervisão técnica:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a supervisão técnica.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  const deleteArea = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('areas_coordenacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAreas(areas.filter(area => area.id !== id));
      toast({
        title: "Supervisão técnica removida",
        description: "Supervisão técnica removida com sucesso.",
      });
      return true;
    } catch (error: any) {
      console.error('Erro ao remover supervisão técnica:', error);
      
      // Verificar se o erro é de restrição de chave estrangeira
      if (error.code === '23503') {
        toast({
          title: "Erro",
          description: "Esta supervisão técnica está em uso e não pode ser removida.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível remover a supervisão técnica.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    areas,
    isLoading,
    isAdding,
    isEditing,
    isDeleting,
    isSubmitting: isAdding || isEditing, // Alias para compatibilidade
    loading: isLoading, // Alias para compatibilidade
    fetchAreas,
    addArea,
    updateArea,
    deleteArea,
  };
};
