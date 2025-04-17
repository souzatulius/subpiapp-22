
import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DemandFormData } from './types';
import { formatQuestionsToObject, isValidPublicUrl, processFileUrls } from '@/utils/questionFormatUtils';
import { validateDemandForm, getErrorSummary } from '@/lib/formValidationUtils';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const useDemandFormSubmit = (resetForm: () => void, onClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showFeedback } = useAnimatedFeedback();

  const submitForm = async (formData: DemandFormData) => {
    if (!user) {
      showFeedback('error', "Você precisa estar logado para submeter o formulário.");
      return;
    }
    
    // Validate the form before submission
    const validationErrors = validateDemandForm(formData, 4); // 4 is the index of the review step
    if (validationErrors.length > 0) {
      const errorSummary = getErrorSummary(validationErrors);
      showFeedback('error', `Campos obrigatórios não preenchidos: ${errorSummary}`);
      throw new Error(`Campos obrigatórios não preenchidos: ${errorSummary}`);
    }
    
    setIsLoading(true);
    
    try {
      // Format perguntas as an object with proper structure
      const formattedPerguntas = formatQuestionsToObject(formData.perguntas);
      
      // Process anexos to ensure they are all valid URLs
      const processedAnexos = processFileUrls(formData.anexos);
      
      // Validate arquivo_url
      const arquivo_url = formData.arquivo_url && isValidPublicUrl(formData.arquivo_url) 
        ? formData.arquivo_url 
        : null;
      
      console.log('Submitting demand with attachments:', {
        arquivo_url,
        anexos: processedAnexos,
        anexosCount: processedAnexos.length
      });
      
      // Ensure prioridade is a valid value that matches database constraints
      const validPrioridade = ['alta', 'media', 'baixa'].includes(formData.prioridade) 
        ? formData.prioridade
        : 'media'; // Default to 'media' if the value is not valid
      
      // Prepare the payload
      const payload = {
        titulo: formData.titulo,
        problema_id: formData.problema_id || null,
        origem_id: formData.origem_id || null,
        tipo_midia_id: formData.tipo_midia_id || null,
        prioridade: validPrioridade,
        prazo_resposta: formData.prazo_resposta,
        nome_solicitante: formData.nome_solicitante,
        telefone_solicitante: formData.telefone_solicitante,
        email_solicitante: formData.email_solicitante,
        veiculo_imprensa: formData.veiculo_imprensa,
        endereco: formData.endereco,
        bairro_id: formData.bairro_id || null,
        perguntas: formattedPerguntas,
        detalhes_solicitacao: formData.detalhes_solicitacao,
        resumo_situacao: formData.resumo_situacao || null,
        arquivo_url,
        anexos: processedAnexos,
        servico_id: formData.servico_id ? formData.servico_id : null,
        coordenacao_id: formData.coordenacao_id || null,
        numero_protocolo_156: formData.tem_protocolo_156 ? formData.numero_protocolo_156 : null,
        autor_id: user.id,
        status: 'pendente'
      };
      
      console.log('Submitting demand with payload:', payload);
      
      // Submit to Supabase
      const { error } = await supabase
        .from('demandas')
        .insert(payload);
        
      if (error) throw error;
      
      // Show animated feedback instead of toast
      showFeedback('success', "Demanda cadastrada com sucesso!");
      
      resetForm();
      onClose();
      
      return true; // Return true to indicate successful submission
    } catch (error: any) {
      console.error("Erro ao submeter formulário:", error);
      
      // Check for database constraint error
      if (error.code === '23502') { // not-null constraint violation
        const errorMessage = error.message || "Campos obrigatórios não preenchidos";
        showFeedback('error', errorMessage);
      } else {
        showFeedback('error', error.message || "Ocorreu um erro ao processar sua solicitação");
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submitForm, handleSubmit: submitForm };
};

export default useDemandFormSubmit;
