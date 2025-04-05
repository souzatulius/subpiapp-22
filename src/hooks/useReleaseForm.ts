
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { NotaFormData } from '@/components/dashboard/forms/schemas/notaFormSchema';

export const useReleaseForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const submitRelease = async (data: NotaFormData, file: File | null = null) => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    setIsSubmitting(true);

    try {
      // Insert the release data
      const { data: insertedData, error } = await supabase
        .from('notas_oficiais')
        .insert({
          titulo: data.titulo,
          conteudo: data.conteudo,
          problema_id: data.problema_id || null,
          tema_id: data.tema_id || null,
          status: data.status,
          user_id: user.id,
        })
        .select('id')
        .single();

      if (error) throw error;

      // If a file was provided, upload it
      if (file && insertedData?.id) {
        const filePath = `notas/${insertedData.id}/${file.name}`;
        const { error: uploadError } = await supabase
          .storage
          .from('nota-attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          // Continue without attachment
        }

        // Link the file to the release
        await supabase
          .from('nota_attachments')
          .insert({
            nota_id: insertedData.id,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
          });
      }

      return true;
    } catch (error) {
      console.error('Error submitting release:', error);
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
