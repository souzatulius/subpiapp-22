
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseRespostaFormStateProps {
  selectedDemanda: any;
  resposta: Record<string, string>;
  setResposta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const useRespostaFormState = ({
  selectedDemanda,
  resposta,
  setResposta
}: UseRespostaFormStateProps) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [selectedServicoId, setSelectedServicoId] = useState<string>('');
  const [dontKnowService, setDontKnowService] = useState<boolean>(false);

  // Initialize form state when demanda changes
  useEffect(() => {
    if (selectedDemanda?.problema_id) {
      setSelectedProblemId(selectedDemanda.problema_id);
    }
    
    // Initialize perguntas and respostas
    if (selectedDemanda?.perguntas) {
      const initialRespostas: Record<string, string> = {};
      
      if (Array.isArray(selectedDemanda.perguntas)) {
        selectedDemanda.perguntas.forEach((pergunta: string, index: number) => {
          initialRespostas[index.toString()] = resposta[index.toString()] || '';
        });
      } else if (typeof selectedDemanda.perguntas === 'object') {
        Object.keys(selectedDemanda.perguntas).forEach((key) => {
          initialRespostas[key] = resposta[key] || '';
        });
      }
      
      console.log('Initializing perguntas:', selectedDemanda.perguntas);
      console.log('Initial respostas:', initialRespostas);
      
      setResposta(initialRespostas);
    }

    // Initialize servico
    if (selectedDemanda?.servico_id) {
      setSelectedServicoId(selectedDemanda.servico_id);
      setDontKnowService(false);
    } else {
      setDontKnowService(selectedDemanda?.servico_id === null);
      setSelectedServicoId('');
    }
    
    console.log('Initializing servico_id:', selectedDemanda?.servico_id);
  }, [selectedDemanda, setResposta, resposta]);

  const handleRespostaChange = (key: string, value: string) => {
    console.log('Changing resposta for key:', key, 'to value:', value);
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleServiceToggle = () => {
    setDontKnowService(!dontKnowService);
    if (!dontKnowService) {
      setSelectedServicoId('');
    }
  };

  const updateService = async () => {
    if ((!dontKnowService && selectedServicoId !== selectedDemanda.servico_id) || 
        (dontKnowService && selectedDemanda.servico_id)) {
      
      const updatePayload: any = { 
        servico_id: dontKnowService ? null : selectedServicoId 
      };
      
      console.log('Updating service with payload:', updatePayload);
      
      const { error: servicoError } = await supabase
        .from('demandas')
        .update(updatePayload)
        .eq('id', selectedDemanda.id);
        
      if (servicoError) {
        console.error('Erro ao atualizar serviço:', servicoError);
        toast({
          title: "Erro ao atualizar serviço",
          description: "Ocorreu um problema ao salvar o serviço da demanda.",
          variant: "destructive"
        });
        throw servicoError;
      }
      
      toast({
        title: "Serviço atualizado",
        description: dontKnowService ? 
          "Marcado como 'Não sei informar o serviço'" : 
          "Serviço atualizado com sucesso",
        variant: "success"
      });
    }
  };

  const allQuestionsAnswered = () => {
    if (!selectedDemanda?.perguntas) return true;
    
    const questions = Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas 
      : Object.values(selectedDemanda.perguntas);
      
    const answers = Object.values(resposta);
    
    // Se não tiver perguntas, considera que está tudo respondido
    if (questions.length === 0) return true;
    
    // Verifica se tem o mesmo número de respostas e perguntas
    if (Object.keys(resposta).length !== (Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas.length 
      : Object.keys(selectedDemanda.perguntas).length)) return false;
    
    // Verifica se todas as respostas estão preenchidas
    return !Object.values(resposta).some(answer => !answer || answer.trim() === '');
  };

  const handleAttachmentAction = (url: string, action: 'view' | 'download') => {
    window.open(url, '_blank');
  };

  return {
    selectedProblemId,
    selectedServicoId,
    dontKnowService,
    setSelectedProblemId,
    setSelectedServicoId,
    handleServiceToggle,
    handleRespostaChange,
    updateService,
    allQuestionsAnswered,
    handleViewAttachment: (url: string) => handleAttachmentAction(url, 'view'),
    handleDownloadAttachment: (url: string) => handleAttachmentAction(url, 'download'),
  };
};
