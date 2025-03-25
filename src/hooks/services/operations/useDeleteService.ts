
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useDeleteService = () => {
  const [isDeleting, setIsDeleting] = useState(false);

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
      
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir serviço:', error);
        throw error;
      }
      
      toast({
        title: "Serviço excluído",
        description: "Serviço excluído com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir serviço:', error);
      
      // Se o erro for de chave estrangeira, mostrar uma mensagem específica
      if (error.code === '23503') { // Código de erro para violação de chave estrangeira
        toast({
          title: "Erro",
          description: "Este serviço está associado a demandas e não pode ser excluído.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o serviço: " + (error.message || "erro desconhecido"),
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
    deleteService
  };
};
