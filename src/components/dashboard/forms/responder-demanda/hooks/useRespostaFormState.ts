
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { normalizeQuestions } from '@/utils/questionFormatUtils';

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
      console.log('Initializing responses from perguntas:', selectedDemanda.perguntas);
      
      // Normalize questions to array format
      const normalizedPerguntas = normalizeQuestions(selectedDemanda.perguntas);
      
      const initialRespostas: Record<string, string> = { ...resposta };
      
      // Create empty response slots for each question
      normalizedPerguntas.forEach((_, index) => {
        if (!initialRespostas[index.toString()]) {
          initialRespostas[index.toString()] = '';
        }
      });
      
      console.log('Normalized perguntas:', normalizedPerguntas);
      console.log('Initial respostas:', initialRespostas);
      
      setResposta(initialRespostas);
    }

    // Initialize servico
    console.log('Initializing service with data:', {
      servico_id: selectedDemanda?.servico_id,
      servico: selectedDemanda?.servico
    });
    
    if (selectedDemanda?.servico_id) {
      setSelectedServicoId(selectedDemanda.servico_id);
      setDontKnowService(false);
    } else {
      setDontKnowService(selectedDemanda?.servico_id === null);
      setSelectedServicoId('');
    }
  }, [selectedDemanda, setResposta]);

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
    
    const normalizedPerguntas = normalizeQuestions(selectedDemanda.perguntas);
    
    // If there are no questions, consider everything answered
    if (normalizedPerguntas.length === 0) return true;
    
    // Check if all questions have answers
    return normalizedPerguntas.every((_, index) => 
      resposta[index.toString()] && resposta[index.toString()].trim() !== ''
    );
  };

  const handleViewAttachment = (url: string) => {
    if (!url.startsWith('http')) {
      toast({
        title: "Erro ao visualizar anexo",
        description: "O URL do anexo é inválido ou não está acessível.",
        variant: "destructive"
      });
      return;
    }
    window.open(url, '_blank');
  };

  const handleDownloadAttachment = (url: string) => {
    if (!url.startsWith('http')) {
      toast({
        title: "Erro ao baixar anexo",
        description: "O URL do anexo é inválido ou não está acessível.",
        variant: "destructive"
      });
      return;
    }
    
    // Create temporary link for download
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = url.split('/').pop() || 'arquivo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    handleViewAttachment,
    handleDownloadAttachment,
  };
};
