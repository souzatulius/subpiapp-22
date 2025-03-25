
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CoordinationArea } from './types';

export const useCoordinationAreasCrud = (
  areas: CoordinationArea[],
  setAreas: React.Dispatch<React.SetStateAction<CoordinationArea[]>>
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addArea = async (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => {
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

  const updateArea = async (id: string, data: { descricao: string, sigla?: string, coordenacao_id?: string }) => {
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
    isAdding,
    isEditing,
    isDeleting,
    isSubmitting: isAdding || isEditing,
    addArea,
    updateArea,
    deleteArea
  };
};
