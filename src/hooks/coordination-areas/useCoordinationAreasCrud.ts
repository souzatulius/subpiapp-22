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
      
      if (data.coordenacao_id) {
        // If a coordenacao_id is provided, use the special RPC function to insert with coordination
        const { data: newAreaId, error: rpcError } = await supabase
          .rpc('insert_supervision_with_coordination', {
            p_descricao: data.descricao,
            p_sigla: data.sigla || null,
            p_coordenacao_id: data.coordenacao_id
          });
          
        if (rpcError) throw rpcError;
        
        // Get the complete record using the ID returned by the function
        const { data: newArea, error: fetchError } = await supabase
          .from('areas_coordenacao')
          .select('*')
          .eq('id', newAreaId)
          .single();
          
        if (fetchError) throw fetchError;
        
        setAreas([...areas, newArea]);
      } else {
        // If no coordenacao_id, insert directly
        const { data: newArea, error } = await supabase
          .from('areas_coordenacao')
          .insert({
            descricao: data.descricao,
            sigla: data.sigla || null,
            is_supervision: true // Mark as supervision, not coordination
          })
          .select()
          .single();

        if (error) throw error;
        
        setAreas([...areas, newArea]);
      }
      
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
      
      let updateResult;
      
      if (updateData.coordenacao_id) {
        // Get coordenacao description
        const { data: coordData, error: coordError } = await supabase
          .from('areas_coordenacao')
          .select('descricao')
          .eq('id', updateData.coordenacao_id)
          .single();
          
        if (coordError) throw coordError;
        
        // Add coordenacao field
        const updatedArea = {
          ...updateData,
          coordenacao: coordData.descricao,
          is_supervision: true // Ensure it's still marked as supervision
        };
        
        // Update with both fields
        updateResult = await supabase
          .from('areas_coordenacao')
          .update(updatedArea)
          .eq('id', id)
          .select();
      } else {
        // If removing coordenacao_id, also null out coordenacao
        const updatedArea = {
          ...updateData,
          coordenacao: null,
          is_supervision: true // Ensure it's still marked as supervision
        };
        
        updateResult = await supabase
          .from('areas_coordenacao')
          .update(updatedArea)
          .eq('id', id)
          .select();
      }
      
      if (updateResult.error) throw updateResult.error;
      
      // Update local state
      setAreas(areas.map(area => 
        area.id === id ? { ...area, ...updateData, coordenacao: updateData.coordenacao_id ? updateResult.data[0].coordenacao : null } : area
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
      
      // Check if area is used as coordenacao_id in other areas
      const { data: referencedData, error: referencedError } = await supabase
        .from('areas_coordenacao')
        .select('id')
        .eq('coordenacao_id', id);
        
      if (referencedError) throw referencedError;
      
      if (referencedData && referencedData.length > 0) {
        toast({
          title: "Erro",
          description: "Esta supervisão técnica está sendo utilizada como coordenação para outras supervisões e não pode ser excluída.",
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
