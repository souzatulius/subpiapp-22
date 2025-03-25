
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAddService = () => {
  const [isAdding, setIsAdding] = useState(false);

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
      
      console.log('Criando serviço com dados:', serviceData);
      
      const { error } = await supabase
        .from('servicos')
        .insert(serviceData);
        
      if (error) {
        console.error('Erro ao adicionar serviço:', error);
        throw error;
      }
      
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

  return {
    isAdding,
    addService
  };
};
