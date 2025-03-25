
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useServiceOperations = (refreshCallback: () => Promise<void>) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addService = async (data: { descricao: string; area_coordenacao_id: string }) => {
    try {
      setIsAdding(true);
      
      // Make sure we have a problema_id
      if (!data.area_coordenacao_id) {
        throw new Error("Área de coordenação não selecionada");
      }
      
      // Get the first problem for this area
      const { data: problemData, error: problemError } = await supabase
        .from('problemas')
        .select('id')
        .eq('area_coordenacao_id', data.area_coordenacao_id)
        .limit(1);
      
      if (problemError) throw problemError;
      
      if (!problemData || problemData.length === 0) {
        // No problem found, create one
        const newProblemData = {
          descricao: `Problema padrão para ${data.descricao}`,
          area_coordenacao_id: data.area_coordenacao_id
        };
        
        const { data: newProblem, error: newProblemError } = await supabase
          .from('problemas')
          .insert(newProblemData)
          .select();
        
        if (newProblemError) throw newProblemError;
        
        // Create service with the new problem
        const serviceData = {
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
          problema_id: newProblem[0].id
        };
        
        const { error } = await supabase
          .from('servicos')
          .insert(serviceData);
          
        if (error) throw error;
      } else {
        // Create service with the existing problem
        const serviceData = {
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
          problema_id: problemData[0].id
        };
        
        const { error } = await supabase
          .from('servicos')
          .insert(serviceData);
          
        if (error) throw error;
      }
      
      await refreshCallback();
      
      toast({
        title: "Serviço adicionado",
        description: "Serviço adicionado com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o serviço.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const updateService = async (id: string, data: { descricao: string; area_coordenacao_id: string }) => {
    try {
      setIsEditing(true);
      
      // Get the current service to check if area_coordenacao_id changed
      const { data: currentService, error: currentServiceError } = await supabase
        .from('servicos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (currentServiceError) throw currentServiceError;
      
      // If area_coordenacao_id changed, we need to update problema_id
      if (currentService.area_coordenacao_id !== data.area_coordenacao_id) {
        // Get a problem for the new area
        const { data: problemData, error: problemError } = await supabase
          .from('problemas')
          .select('id')
          .eq('area_coordenacao_id', data.area_coordenacao_id)
          .limit(1);
        
        if (problemError) throw problemError;
        
        if (!problemData || problemData.length === 0) {
          // No problem found, create one
          const newProblemData = {
            descricao: `Problema padrão para ${data.descricao}`,
            area_coordenacao_id: data.area_coordenacao_id
          };
          
          const { data: newProblem, error: newProblemError } = await supabase
            .from('problemas')
            .insert(newProblemData)
            .select();
          
          if (newProblemError) throw newProblemError;
          
          // Update service with new problem_id
          const serviceData = {
            descricao: data.descricao,
            area_coordenacao_id: data.area_coordenacao_id,
            problema_id: newProblem[0].id
          };
          
          const { error } = await supabase
            .from('servicos')
            .update(serviceData)
            .eq('id', id);
            
          if (error) throw error;
        } else {
          // Update service with existing problem_id
          const serviceData = {
            descricao: data.descricao,
            area_coordenacao_id: data.area_coordenacao_id,
            problema_id: problemData[0].id
          };
          
          const { error } = await supabase
            .from('servicos')
            .update(serviceData)
            .eq('id', id);
            
          if (error) throw error;
        }
      } else {
        // Just update the description
        const { error } = await supabase
          .from('servicos')
          .update({ descricao: data.descricao })
          .eq('id', id);
          
        if (error) throw error;
      }
      
      await refreshCallback();
      
      toast({
        title: "Serviço atualizado",
        description: "Serviço atualizado com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Check if there are any demandas using this service
      const { data: demandasData, error: demandasError } = await supabase
        .from('demandas')
        .select('id')
        .eq('servico_id', id);
      
      if (demandasError) throw demandasError;
      
      if (demandasData && demandasData.length > 0) {
        toast({
          title: "Erro",
          description: "Este serviço está associado a demandas e não pode ser excluído.",
          variant: "destructive",
        });
        return false;
      }
      
      // If no dependent records, proceed with deletion
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: "Serviço excluído",
        description: "Serviço excluído com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir serviço:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível excluir o serviço.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isSubmitting: isAdding || isEditing,
    isDeleting,
    addService,
    updateService,
    deleteService
  };
};
