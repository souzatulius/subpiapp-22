
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Area } from '../types';

export const useUpdateArea = (
  areas: Area[],
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>
) => {
  const [isEditing, setIsEditing] = useState(false);

  const updateArea = async (id: string, data: { descricao: string, sigla?: string, coordenacao_id?: string }) => {
    try {
      setIsEditing(true);
      console.log('Updating area with data:', data, 'is_supervision=true');
      
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
      
      console.log('Updated area:', updateResult.data[0]);
      
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

  return {
    isEditing,
    updateArea
  };
};
