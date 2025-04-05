
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
          texto: data.conteudo, // Use text field in DB
          problema_id: data.problema_id || null,
          tema_id: data.tema_id || null,
          status: data.status,
          user_id: user.id,
        })
        .select('id')
        .single();

      if (error) throw error;

      // If a file was provided and file storage support is available, upload it
      if (file && insertedData?.id) {
        try {
          const filePath = `notas/${insertedData.id}/${file.name}`;
          const { error: uploadError } = await supabase
            .storage
            .from('nota-attachments')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            // Continue without attachment
          } else {
            // Try to link the file to the release if the table exists
            try {
              await supabase
                .from('nota_anexos') // Using a more conventional table name
                .insert({
                  nota_id: insertedData.id,
                  caminho_arquivo: filePath,
                  nome_arquivo: file.name,
                  tamanho_arquivo: file.size,
                  tipo_arquivo: file.type,
                });
            } catch (linkError) {
              console.error('Error linking file to release:', linkError);
              // Continue even if linking fails
            }
          }
        } catch (storageError) {
          console.error('Error with storage operations:', storageError);
          // Continue even if storage operations fail
        }
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
