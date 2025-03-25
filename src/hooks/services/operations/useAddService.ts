
import { useState } from 'react';
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
      
      // Service functionality has been removed
      console.log('Service functionality has been removed');
      
      toast({
        title: "Funcionalidade removida",
        description: "A funcionalidade de serviços foi removida do sistema.",
        variant: "destructive",
      });
      
      return false;
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
