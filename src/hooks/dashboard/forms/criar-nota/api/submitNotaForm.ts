
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/types/demand';

interface SubmitNotaFormProps {
  titulo: string;
  texto: string;
  userId: string | undefined;
  selectedDemandaId: string;
  selectedDemanda: Demand | null;
}

export const submitNotaForm = async ({
  titulo,
  texto,
  userId,
  selectedDemandaId,
  selectedDemanda
}: SubmitNotaFormProps): Promise<boolean> => {
  if (!userId) {
    toast({
      title: "Erro de autenticação",
      description: "Você precisa estar logado para criar uma nota.",
      variant: "destructive"
    });
    return false;
  }

  try {
    // Buscar o ID do problema associado à área da demanda
    let problemaId = selectedDemanda?.problema_id;
    
    // If there's no problem ID, we need to create one
    if (!problemaId) {
      const { data: problemaData, error: problemaError } = await supabase
        .from('problemas')
        .select('id')
        .limit(1);
      
      if (problemaError) throw problemaError;
      
      if (!problemaData || problemaData.length === 0) {
        // Create a default problem
        const coordenacaoId = selectedDemanda?.coordenacao_id || null;
        
        const { data: newProblema, error: newProblemaError } = await supabase
          .from('problemas')
          .insert({ 
            descricao: 'Problema Padrão',
            coordenacao_id: coordenacaoId 
          })
          .select();
          
        if (newProblemaError) throw newProblemaError;
        
        problemaId = newProblema[0].id;
      } else {
        problemaId = problemaData[0].id;
      }
    }
    
    // Create the note
    const { data, error } = await supabase
      .from('notas_oficiais')
      .insert({
        titulo,
        texto,
        coordenacao_id: selectedDemanda?.coordenacao_id || null,
        autor_id: userId,
        status: 'pendente',
        demanda_id: selectedDemandaId,
        problema_id: problemaId
      })
      .select();
    
    if (error) throw error;
    
    // Update the demand status
    const { error: updateError } = await supabase
      .from('demandas')
      .update({ status: 'respondida' })
      .eq('id', selectedDemandaId);
      
    if (updateError) {
      console.error('Error updating demand status:', updateError);
    }
    
    toast({
      title: "Nota oficial criada com sucesso!",
      description: "A nota foi enviada para aprovação.",
    });
    
    return true;
  } catch (error: any) {
    console.error('Erro ao criar nota oficial:', error);
    toast({
      title: "Erro ao criar nota oficial",
      description: error.message || "Ocorreu um erro ao processar sua solicitação.",
      variant: "destructive"
    });
    return false;
  }
};
