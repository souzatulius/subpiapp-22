
import { useState } from 'react';
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
      
      // Service functionality has been removed
      console.log('Service functionality has been removed');
      
      toast({
        title: "Funcionalidade removida",
        description: "A funcionalidade de serviços foi removida do sistema.",
        variant: "destructive",
      });
      
      return false;
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
    isDeleting,
    deleteService
  };
};
