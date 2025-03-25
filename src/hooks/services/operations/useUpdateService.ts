
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useUpdateService = () => {
  const [isEditing, setIsEditing] = useState(false);

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
      
      // Service functionality has been removed
      console.log('Service functionality has been removed');
      
      toast({
        title: "Funcionalidade removida",
        description: "A funcionalidade de serviços foi removida do sistema.",
        variant: "destructive",
      });
      
      return false;
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

  return {
    isEditing,
    updateService
  };
};
