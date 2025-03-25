
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useServiceOperations = (refreshCallback: () => Promise<void>) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addService = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    if (!data.descricao || !data.supervisao_tecnica_id) {
      toast({
        title: "Erro",
        description: "A descrição e a supervisão técnica são obrigatórias.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsAdding(true);
      
      // Verificar se já existe um problema para esta supervisão técnica
      const { data: problemData, error: problemError } = await supabase
        .from('problemas')
        .select('id')
        .eq('supervisao_tecnica_id', data.supervisao_tecnica_id)
        .limit(1);
      
      if (problemError) {
        console.error('Erro ao buscar problema:', problemError);
        throw problemError;
      }
      
      let problemaId;
      
      if (!problemData || problemData.length === 0) {
        // Não encontrou problema, criar um novo
        const newProblemData = {
          descricao: `Problema padrão para ${data.descricao}`,
          supervisao_tecnica_id: data.supervisao_tecnica_id
        };
        
        const { data: newProblem, error: newProblemError } = await supabase
          .from('problemas')
          .insert(newProblemData)
          .select();
        
        if (newProblemError) {
          console.error('Erro ao criar problema:', newProblemError);
          throw newProblemError;
        }
        
        problemaId = newProblem[0].id;
      } else {
        problemaId = problemData[0].id;
      }
      
      // Criar serviço com o problema encontrado ou criado
      const serviceData = {
        descricao: data.descricao,
        supervisao_id: data.supervisao_tecnica_id,
        problema_id: problemaId
      };
      
      const { error } = await supabase
        .from('servicos')
        .insert(serviceData);
        
      if (error) {
        console.error('Erro ao adicionar serviço:', error);
        throw error;
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
        description: "Não foi possível adicionar o serviço: " + (error.message || "erro desconhecido"),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const updateService = async (id: string, data: { descricao: string; supervisao_tecnica_id: string }) => {
    if (!id || !data.descricao || !data.supervisao_tecnica_id) {
      toast({
        title: "Erro",
        description: "Dados inválidos para atualização do serviço.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsEditing(true);
      
      // Obter o serviço atual para verificar se a supervisão técnica mudou
      const { data: currentService, error: currentServiceError } = await supabase
        .from('servicos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (currentServiceError) {
        console.error('Erro ao buscar serviço atual:', currentServiceError);
        throw currentServiceError;
      }
      
      // Se a supervisão técnica mudou, precisamos atualizar o problema_id
      if (currentService.supervisao_id !== data.supervisao_tecnica_id) {
        // Buscar um problema para a nova área
        const { data: problemData, error: problemError } = await supabase
          .from('problemas')
          .select('id')
          .eq('supervisao_tecnica_id', data.supervisao_tecnica_id)
          .limit(1);
        
        if (problemError) {
          console.error('Erro ao buscar problema:', problemError);
          throw problemError;
        }
        
        let problemaId;
        
        if (!problemData || problemData.length === 0) {
          // Não encontrou problema, criar um novo
          const newProblemData = {
            descricao: `Problema padrão para ${data.descricao}`,
            supervisao_tecnica_id: data.supervisao_tecnica_id
          };
          
          const { data: newProblem, error: newProblemError } = await supabase
            .from('problemas')
            .insert(newProblemData)
            .select();
          
          if (newProblemError) {
            console.error('Erro ao criar problema:', newProblemError);
            throw newProblemError;
          }
          
          problemaId = newProblem[0].id;
        } else {
          problemaId = problemData[0].id;
        }
        
        // Atualizar serviço com o novo problema_id
        const serviceData = {
          descricao: data.descricao,
          supervisao_id: data.supervisao_tecnica_id,
          problema_id: problemaId
        };
        
        const { error } = await supabase
          .from('servicos')
          .update(serviceData)
          .eq('id', id);
          
        if (error) {
          console.error('Erro ao atualizar serviço:', error);
          throw error;
        }
      } else {
        // Apenas atualizar a descrição
        const { error } = await supabase
          .from('servicos')
          .update({ descricao: data.descricao })
          .eq('id', id);
          
        if (error) {
          console.error('Erro ao atualizar descrição do serviço:', error);
          throw error;
        }
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
        description: "Não foi possível atualizar o serviço: " + (error.message || "erro desconhecido"),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID do serviço inválido.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsDeleting(true);
      
      // Verificar se existem demandas usando este serviço
      const { data: demandasData, error: demandasError } = await supabase
        .from('demandas')
        .select('id')
        .eq('servico_id', id);
      
      if (demandasError) {
        console.error('Erro ao verificar demandas:', demandasError);
        throw demandasError;
      }
      
      if (demandasData && demandasData.length > 0) {
        toast({
          title: "Erro",
          description: "Este serviço está associado a demandas e não pode ser excluído.",
          variant: "destructive",
        });
        return false;
      }
      
      // Se não houver demandas vinculadas, prosseguir com a exclusão
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir serviço:', error);
        throw error;
      }
      
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
        description: "Não foi possível excluir o serviço: " + (error.message || "erro desconhecido"),
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
