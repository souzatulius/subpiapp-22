
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
    console.log("Starting submitNotaForm with:", { userId, selectedDemandaId });
    
    // First, try to get the problema_id from the selectedDemanda
    let problemaId = selectedDemanda?.problema_id;
    console.log("Initial problema_id from selectedDemanda:", problemaId);
    
    // If there's no problem ID, we need to find or create one
    if (!problemaId) {
      console.log("No problema_id found, looking for existing problems");
      
      // Look for a problem associated with the coordination
      let query = supabase.from('problemas').select('id');
      
      // If we have a coordenacao_id, filter by it
      if (selectedDemanda?.coordenacao_id) {
        query = query.eq('coordenacao_id', selectedDemanda.coordenacao_id);
      }
      
      // Get the first problem as a fallback
      const { data: problemaData, error: problemaError } = await query.limit(1);
      
      if (problemaError) {
        console.error('Error fetching problems:', problemaError);
        throw problemaError;
      }
      
      if (problemaData && problemaData.length > 0) {
        problemaId = problemaData[0].id;
        console.log("Using existing problem:", problemaId);
      } else {
        console.log("No existing problem found, creating a new one");
        
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
          console.error('Error creating problem:', newProblemaError);
          throw newProblemaError;
        }
        
        problemaId = newProblema[0].id;
        console.log("Created new problem:", problemaId);
      }
    }
    
    console.log("Final problema_id to use:", problemaId);
    
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
    
    console.log("Inserting note with data:", noteData);
    
    // Create the note
    const { data, error } = await supabase
      .from('notas_oficiais')
      .insert(noteData)
      .select();
    
    if (error) {
      console.error('Error creating note:', error);
      throw error;
    }
    
    console.log("Note created successfully:", data);
    
    // Update the demand status
    const { error: updateError } = await supabase
      .from('demandas')
      .update({ status: 'respondida' })
      .eq('id', selectedDemandaId);
      
    if (updateError) {
      console.error('Error updating demand status:', updateError);
      // Don't throw here as the note was already created
    } else {
      console.log("Demand status updated to 'respondida'");
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
