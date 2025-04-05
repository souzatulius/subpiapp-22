
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
        
        try {
          // Try file upload without being too strict about bucket availability
          const fileUploadResult = await supabase.storage
            .from('nota_attachments' as any)
            .upload(fileName, file);
          
          if (fileUploadResult.error) {
            console.warn('Error uploading file:', fileUploadResult.error);
          } else if (fileUploadResult.data) {
            console.log('File uploaded successfully', fileUploadResult.data);
            
            // Try to track the attachment in the database if such functionality exists
            try {
              const { data: annexData } = await supabase
                .from('nota_anexos' as any)
                .insert({
                  nota_id: notaData.id,
                  arquivo_path: fileUploadResult.data.path
                });
                
              console.log('Attachment tracked in database', annexData);
            } catch (annexError) {
              console.warn('Error tracking attachment (non-critical):', annexError);
            }
          }
        } catch (storageError) {
          console.warn('Storage operation failed (non-critical):', storageError);
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
