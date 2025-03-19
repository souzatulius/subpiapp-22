
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DemandFormData } from './types';

export const useDemandFormSubmit = (
  userId: string | undefined,
  formData: DemandFormData,
  setIsLoading: (loading: boolean) => void,
  onClose: () => void
) => {
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!userId) {
        throw new Error("Usuário não identificado. Por favor, faça login novamente.");
      }

      // Filter out empty questions
      const filteredPerguntas = formData.perguntas.filter(p => p.trim() !== '');
      
      // Prepare demand data
      const demandaData = {
        ...formData,
        perguntas: filteredPerguntas.length > 0 ? filteredPerguntas : null,
        autor_id: userId,
        status: 'pendente'
      };

      console.log('Submitting demand data:', demandaData);

      // Insert into demandas table
      const { data, error } = await supabase
        .from('demandas')
        .insert([demandaData])
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      toast({
        title: "Demanda cadastrada com sucesso!",
        description: "A solicitação foi registrada no sistema."
      });
      
      onClose();
    } catch (error: any) {
      console.error('Erro ao cadastrar demanda:', error);
      toast({
        title: "Erro ao cadastrar demanda",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
};
