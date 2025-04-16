
import { supabase } from '@/integrations/supabase/client';
import { Demand } from '@/types/demand';
import { useFeedback } from '@/components/ui/feedback-provider';

interface SubmitNotaFormProps {
  titulo: string;
  texto: string;
  userId: string | undefined;
  selectedDemandaId: string;
  selectedDemanda: Demand | null;
}

// Create a function to get the feedback context for non-component use
let showFeedbackFn: (type: any, message: string, options?: any) => void;

export const setFeedbackFunction = (fn: (type: any, message: string, options?: any) => void) => {
  showFeedbackFn = fn;
};

export const submitNotaForm = async ({
  titulo,
  texto,
  userId,
  selectedDemandaId,
  selectedDemanda
}: SubmitNotaFormProps): Promise<boolean> => {
  if (!userId) {
    if (showFeedbackFn) {
      showFeedbackFn('error', 'Você precisa estar autenticado para criar uma nota.');
    }
    return false;
  }

  try {
    if (showFeedbackFn) {
      showFeedbackFn('loading', 'Iniciando criação da nota...', { progress: 10 });
    }
    
    // First, try to get the problema_id from the selectedDemanda
    let problemaId = selectedDemanda?.problema_id;
    
    // If there's no problem ID, we need to find or create one
    if (!problemaId) {
      if (showFeedbackFn) {
        showFeedbackFn('loading', 'Verificando problema associado...', { progress: 30 });
      }
      
      // Look for a problem associated with the coordination
      let query = supabase.from('problemas').select('id');
      
      // If we have a coordenacao_id, filter by it
      if (selectedDemanda?.coordenacao_id) {
        query = query.eq('coordenacao_id', selectedDemanda.coordenacao_id);
      }
      
      // Get the first problem as a fallback
      const { data: problemaData, error: problemaError } = await query.limit(1);
      
      if (problemaError) {
        throw problemaError;
      }
      
      if (problemaData && problemaData.length > 0) {
        problemaId = problemaData[0].id;
      } else {
        if (showFeedbackFn) {
          showFeedbackFn('loading', 'Criando problema associado...', { progress: 40 });
        }
        
        // Create a default problem
        const coordenacaoId = selectedDemanda?.coordenacao_id || null;
        
        const { data: newProblema, error: newProblemaError } = await supabase
          .from('problemas')
          .insert({ 
            descricao: 'Problema Padrão',
            coordenacao_id: coordenacaoId 
          })
          .select();
          
        if (newProblemaError) {
          throw newProblemaError;
        }
        
        problemaId = newProblema[0].id;
      }
    }
    
    if (showFeedbackFn) {
      showFeedbackFn('loading', 'Criando nota...', { progress: 60 });
    }
    
    // Prepare the data for inserting the note
    const noteData = {
      titulo,
      texto,
      coordenacao_id: selectedDemanda?.coordenacao_id || null,
      autor_id: userId,
      status: 'pendente',
      demanda_id: selectedDemandaId,
      problema_id: problemaId
    };
    
    // Create the note
    const { data, error } = await supabase
      .from('notas_oficiais')
      .insert(noteData)
      .select();
    
    if (error) {
      throw error;
    }
    
    if (showFeedbackFn) {
      showFeedbackFn('loading', 'Atualizando status da demanda...', { progress: 80 });
    }
    
    // Update the demand status
    const { error: updateError } = await supabase
      .from('demandas')
      .update({ status: 'respondida' })
      .eq('id', selectedDemandaId);
      
    if (updateError) {
      console.error('Error updating demand status:', updateError);
      // Don't throw here as the note was already created
    }
    
    if (showFeedbackFn) {
      showFeedbackFn('success', 'Nota oficial criada com sucesso!');
    }
    
    return true;
  } catch (error: any) {
    if (showFeedbackFn) {
      showFeedbackFn('error', `Erro ao criar nota oficial: ${error.message || 'Erro desconhecido'}`);
    }
    return false;
  }
};
