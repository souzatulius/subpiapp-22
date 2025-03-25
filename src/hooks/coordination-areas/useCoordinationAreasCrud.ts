
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
      
      // Prepare update data - remove coordenacao_id if it's empty string
      const updateData = { ...data };
      if (updateData.coordenacao_id === '') {
        delete updateData.coordenacao_id;
      }
      
      const { error } = await supabase
        .from('areas_coordenacao')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setAreas(areas.map(area => 
        area.id === id ? { ...area, ...updateData } : area
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
      
      // First check if area is used by any services
      const { data: servicesData, error: servicesError } = await supabase
        .from('servicos')
        .select('id')
        .eq('area_coordenacao_id', id);
        
      if (servicesError) throw servicesError;
      
      if (servicesData && servicesData.length > 0) {
        toast({
          title: "Erro",
          description: "Esta supervisão técnica está sendo utilizada por serviços e não pode ser excluída.",
          variant: "destructive",
        });
        return false;
      }
      
      // Then check if area is used by any problems
      const { data: problemsData, error: problemsError } = await supabase
        .from('problemas')
        .select('id')
        .eq('area_coordenacao_id', id);
        
      if (problemsError) throw problemsError;
      
      if (problemsData && problemsData.length > 0) {
        toast({
          title: "Erro",
          description: "Esta supervisão técnica está sendo utilizada por problemas/temas e não pode ser excluída.",
          variant: "destructive",
        });
        return false;
      }
      
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
      
      // Check for foreign key constraint error
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
