
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export type Coordination = {
  id: string;
  descricao: string;
  sigla: string;
  criado_em?: string;
};

export const useCoordination = () => {
  const [coordinations, setCoordinations] = useState<Coordination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCoordinations = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching coordinations with is_supervision=false...');
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .is('coordenacao_id', null) // Select only top-level coordinations
        .eq('is_supervision', false) // Explicitly filter for coordinations only
        .order('descricao');

      if (error) throw error;
      
      console.log('Fetched coordinations from Supabase:', data);
      setCoordinations(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar coordenações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as coordenações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoordinations();
  }, [fetchCoordinations]);

  const addCoordination = async (data: { descricao: string, sigla: string }) => {
    try {
      setIsAdding(true);
      
      console.log('Adding new coordination with data:', data);
      
      // Make sure to explicitly set is_supervision to false
      const { data: newCoordination, error } = await supabase
        .from('areas_coordenacao')
        .insert({
          ...data,
          is_supervision: false // Explicitly mark as coordination, not supervision
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Added new coordination successfully:', newCoordination);
      setCoordinations([...coordinations, newCoordination]);
      toast({
        title: "Coordenação adicionada",
        description: "Coordenação adicionada com sucesso.",
      });
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar coordenação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a coordenação.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const updateCoordination = async (id: string, data: { descricao: string, sigla: string }) => {
    try {
      setIsEditing(true);
      console.log('Updating coordination with id:', id, 'and data:', data);
      
      const { error } = await supabase
        .from('areas_coordenacao')
        .update({
          ...data,
          is_supervision: false // Ensure it's still marked as coordination
        })
        .eq('id', id);

      if (error) throw error;
      
      console.log('Coordination updated successfully');
      setCoordinations(coordinations.map(coordination => 
        coordination.id === id ? { ...coordination, ...data } : coordination
      ));
      
      toast({
        title: "Coordenação atualizada",
        description: "Coordenação atualizada com sucesso.",
      });
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar coordenação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a coordenação.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  const deleteCoordination = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Check if there are any temas using this coordination
      const { data: temasData, error: temasError } = await supabase
        .from('problemas')
        .select('id')
        .eq('area_coordenacao_id', id);
      
      if (temasError) throw temasError;
      
      if (temasData && temasData.length > 0) {
        toast({
          title: "Erro",
          description: "Esta coordenação está associada a temas e não pode ser excluída.",
          variant: "destructive",
        });
        return false;
      }
      
      const { error } = await supabase
        .from('areas_coordenacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCoordinations(coordinations.filter(coordination => coordination.id !== id));
      toast({
        title: "Coordenação removida",
        description: "Coordenação removida com sucesso.",
      });
      return true;
    } catch (error: any) {
      console.error('Erro ao remover coordenação:', error);
      
      // Check for foreign key constraint error
      if (error.code === '23503') {
        toast({
          title: "Erro",
          description: "Esta coordenação está em uso e não pode ser removida.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível remover a coordenação.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    coordinations,
    loading: isLoading,
    isSubmitting: isAdding || isEditing,
    isDeleting,
    fetchCoordinations,
    addCoordination,
    updateCoordination,
    deleteCoordination,
  };
};
