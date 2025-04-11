
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export interface ReleaseFormValues {
  titulo: string;
  conteudo: string;
  problema_id: string;
  tema_id?: string;
  status?: string;
}

export const useReleaseForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { showFeedback } = useAnimatedFeedback();
  
  const submitRelease = async (data: ReleaseFormValues, file: File | null) => {
    if (!user) {
      showFeedback('error', 'Você precisa estar autenticado para criar uma nota oficial');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the nota in notas_oficiais table
      const { data: notaData, error: notaError } = await supabase
        .from('notas_oficiais')
        .insert({
          titulo: data.titulo,
          texto: data.conteudo, // Using texto field instead of conteudo
          problema_id: data.problema_id,
          autor_id: user.id,
          status: data.status || 'pendente'
        })
        .select()
        .single();
      
      if (notaError) throw notaError;
      
      // Upload attachment if file is provided
      if (file && notaData) {
        const fileExt = file.name.split('.').pop();
        const fileName = `nota-${notaData.id}-${Date.now()}.${fileExt}`;
        
        // Check if storage bucket exists before trying to upload
        try {
          const { data: fileData, error: fileError } = await supabase.storage
            .from('nota_attachments')
            .upload(fileName, file);
          
          if (fileError) {
            console.error('Error uploading file:', fileError);
          } else if (fileData) {
            // If we successfully uploaded the file, now try to add reference in the database
            try {
              // Update archivo_url field (ensure this field exists in your table)
              const updateData: Record<string, any> = {};
              updateData.arquivo_url = fileData.path;
              
              const { error: updateError } = await supabase
                .from('notas_oficiais')
                .update(updateData)
                .eq('id', notaData.id);
                
              if (updateError) {
                console.warn('Could not update nota with attachment:', updateError);
              }
            } catch (e) {
              console.warn('Error linking attachment to nota:', e);
            }
          }
        } catch (e) {
          console.warn('Storage bucket nota_attachments may not exist:', e);
        }
      }
      
      showFeedback('success', 'Nota criada com sucesso');
      
      return true;
    } catch (error: any) {
      console.error('Error creating nota oficial:', error);
      showFeedback('error', error.message || "Ocorreu um erro ao criar a nota oficial");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    submitRelease
  };
};
