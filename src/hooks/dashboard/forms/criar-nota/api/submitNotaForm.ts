
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/types/demand';

interface SubmitNotaFormParams {
  titulo: string;
  texto: string;
  userId: string | undefined;
  selectedDemandaId: string;
  selectedDemanda: Demand | null;
}

/**
 * Submits the nota form to the server
 */
export const submitNotaForm = async ({
  titulo,
  texto,
  userId,
  selectedDemandaId,
  selectedDemanda
}: SubmitNotaFormParams) => {
  try {
    // Get problema data to associate with the note
    const { data: problemaData, error: problemaError } = await supabase
      .from('problemas')
      .select('id, coordenacao_id')
      .eq('id', selectedDemanda?.problema_id || '')
      .maybeSingle();
    
    if (problemaError && problemaError.code !== 'PGRST116') {
      throw problemaError;
    }
    
    let problemaId = selectedDemanda?.problema_id;
    let coordenacaoId = problemaData?.coordenacao_id || selectedDemanda?.coordenacao_id || null;
    
    if (!problemaId) {
      // If no problema_id found on demand, create a default one
      const { data: newProblema, error: newProblemaError } = await supabase
        .from('problemas')
        .insert({ 
          descricao: 'Problema Padrão',
          coordenacao_id: coordenacaoId
        })
        .select();
        
      if (newProblemaError) throw newProblemaError;
      
      problemaId = newProblema[0].id;
    }
    
    // Create the note including coordenacao_id from the problema
    const { data, error } = await supabase
      .from('notas_oficiais')
      .insert({
        titulo,
        texto,
        autor_id: userId,
        status: 'pendente',
        demanda_id: selectedDemandaId,
        problema_id: problemaId,
        coordenacao_id: coordenacaoId
      })
      .select();
    
    if (error) throw error;
    
    // Update the demand status to reflect that a note has been created
    const { error: updateError } = await supabase
      .from('demandas')
      .update({ status: 'aguardando_aprovacao' })
      .eq('id', selectedDemandaId);
      
    if (updateError) {
      console.error('Error updating demand status:', updateError);
      // Don't throw here, we still want to show success for the note creation
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
