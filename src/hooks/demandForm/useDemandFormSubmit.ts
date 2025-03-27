
import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DemandFormData } from './types';
import { formatQuestionsToObject, isValidPublicUrl } from '@/utils/questionFormatUtils';
import { validateDemandForm, getErrorSummary } from '@/lib/formValidationUtils';

export const useDemandFormSubmit = (resetForm: () => void, onClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const submitForm = async (formData: DemandFormData) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para submeter o formulário.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate the form before submission
    const validationErrors = validateDemandForm(formData, 4); // 4 is the index of the review step
    if (validationErrors.length > 0) {
      const errorSummary = getErrorSummary(validationErrors);
      throw new Error(`Campos obrigatórios não preenchidos: ${errorSummary}`);
    }
    
    setIsLoading(true);
    
    try {
      // Format perguntas as an object with proper structure
      const formattedPerguntas = formatQuestionsToObject(formData.perguntas);
      
      // Make sure anexos has valid URLs
      const validAnexos = formData.anexos.filter(url => isValidPublicUrl(url));
      
      // Validate arquivo_url
      const arquivo_url = formData.arquivo_url && isValidPublicUrl(formData.arquivo_url) 
        ? formData.arquivo_url 
        : null;
      
      // Prepare the payload - remove fields that don't exist in the demandas table
      // and ensure all UUID fields have valid values (not empty strings)
      const payload = {
        titulo: formData.titulo,
        problema_id: formData.problema_id || null,
        origem_id: formData.origem_id || null,
        tipo_midia_id: formData.tipo_midia_id || null,
        prioridade: formData.prioridade,
        prazo_resposta: formData.prazo_resposta,
        nome_solicitante: formData.nome_solicitante,
        telefone_solicitante: formData.telefone_solicitante,
        email_solicitante: formData.email_solicitante,
        veiculo_imprensa: formData.veiculo_imprensa,
        endereco: formData.endereco,
        bairro_id: formData.bairro_id || null,
        perguntas: formattedPerguntas,
        detalhes_solicitacao: formData.detalhes_solicitacao,
        arquivo_url,
        anexos: validAnexos,
        servico_id: formData.servico_id ? formData.servico_id : null,
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
      
      // Check for database constraint error
      if (error.code === '23502') { // not-null constraint violation
        const errorMessage = error.message || "Campos obrigatórios não preenchidos";
        throw new Error(errorMessage);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Added handleSubmit method to match the expected interface
  const handleSubmit = submitForm;

  return { isLoading, submitForm, handleSubmit };
};

export default useDemandFormSubmit;
