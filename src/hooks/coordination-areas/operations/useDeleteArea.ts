
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Area } from '../types';

export const useDeleteArea = (
  areas: Area[],
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>
) => {
  const [isDeleting, setIsDeleting] = useState(false);

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
    isDeleting,
    deleteArea
  };
};
