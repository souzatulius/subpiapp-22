
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Area } from '../types';

export const useAddArea = (
  areas: Area[],
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>
) => {
  const [isAdding, setIsAdding] = useState(false);

  const addArea = async (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => {
    try {
      setIsAdding(true);
      
      if (data.coordenacao_id) {
        // If a coordenacao_id is provided, use the special RPC function to insert with coordination
        const { data: newAreaId, error: rpcError } = await supabase
          .rpc('insert_supervision_with_coordination', {
            p_descricao: data.descricao,
            p_sigla: data.sigla || null,
            p_coordenacao_id: data.coordenacao_id,
            p_is_supervision: true // Explicitly set as supervision
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
        // If no coordenacao_id, insert directly and explicitly mark as supervision
        const { data: newArea, error } = await supabase
          .from('areas_coordenacao')
          .insert({
            descricao: data.descricao,
            sigla: data.sigla || null,
            is_supervision: true // Explicitly mark as supervision
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

  return {
    isAdding,
    addArea
  };
};
