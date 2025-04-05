
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';

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
  
  const submitRelease = async (data: ReleaseFormValues, file: File | null) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar autenticado para criar uma nota oficial.",
        variant: "destructive"
      });
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
              // Try to use an existing anexos table if it exists
              const { error: anexoError } = await supabase.rpc('add_nota_attachment', {
                nota_id: notaData.id,
                file_path: fileData.path
              });
              
              if (anexoError) {
                console.warn('Could not use RPC add_nota_attachment, attachment not linked to nota');
              }
            } catch (e) {
              console.warn('Error linking attachment to nota:', e);
            }
          }
        } catch (e) {
          console.warn('Storage bucket nota_attachments may not exist:', e);
        }
      }
      
      toast({
        title: "Nota criada com sucesso",
        description: "A nota oficial foi enviada para revisão e aprovação.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error creating nota oficial:', error);
      toast({
        title: "Erro ao criar nota",
        description: error.message || "Ocorreu um erro ao criar a nota oficial.",
        variant: "destructive"
      });
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
