
import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DemandFormData } from './types';

export const useDemandFormSubmit = (resetForm: () => void, onClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const formatPerguntasToObject = (perguntas: string[]) => {
    // Filter out empty questions and create a structured object
    const filteredPerguntas = perguntas.filter(p => p.trim() !== '');
    
    // Create a formatted perguntas object
    const perguntasObj: Record<string, string> = {};
    
    filteredPerguntas.forEach((pergunta, index) => {
      perguntasObj[`pergunta_${index + 1}`] = pergunta;
    });
    
    return perguntasObj;
  };

  const validateAttachmentUrl = (url: string): boolean => {
    return url && url.startsWith('http') && !url.startsWith('blob:');
  };

  const submitForm = async (formData: DemandFormData) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para submeter o formulário.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format perguntas as an object with proper structure
      const formattedPerguntas = formatPerguntasToObject(formData.perguntas);
      
      // Make sure anexos has valid URLs
      const validAnexos = formData.anexos.filter(url => validateAttachmentUrl(url));
      
      // Validate arquivo_url
      const arquivo_url = formData.arquivo_url && validateAttachmentUrl(formData.arquivo_url) 
        ? formData.arquivo_url 
        : null;
      
      // Prepare the payload
      const payload = {
        ...formData,
        perguntas: formattedPerguntas,
        anexos: validAnexos,
        arquivo_url,
        autor_id: user.id,
        status: 'pendente'
      };
      
      console.log('Submitting demand with payload:', payload);
      
      // Submit to Supabase
      const { error } = await supabase
        .from('demandas')
        .insert(payload);
        
      if (error) throw error;
      
      toast({
        title: "Demanda cadastrada com sucesso!",
        description: "A demanda foi cadastrada e será analisada pela equipe.",
      });
      
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Erro ao submeter formulário:", error);
      toast({
        title: "Erro ao cadastrar demanda",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Added handleSubmit method to match the expected interface
  const handleSubmit = submitForm;

  return { isLoading, submitForm, handleSubmit };
};

export default useDemandFormSubmit;
