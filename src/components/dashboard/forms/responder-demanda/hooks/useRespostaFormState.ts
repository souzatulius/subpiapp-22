
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

  // Parse perguntas into a normalized format for resposta
  const normalizePerguntas = (perguntas: any): { key: string, value: string }[] => {
    if (!perguntas) return [];

    // If it's already an object with key/value pairs
    if (typeof perguntas === 'object' && !Array.isArray(perguntas)) {
      return Object.entries(perguntas).map(([key, value]) => ({
        key: key.startsWith('pergunta_') ? key : `pergunta_${key}`,
        value: String(value)
      }));
    }
    
    // If it's an array of strings
    if (Array.isArray(perguntas)) {
      return perguntas
        .filter(p => p && String(p).trim() !== '')
        .map((pergunta, index) => ({
          key: `${index}`,
          value: String(pergunta)
        }));
    }
    
    // If it's a JSON string, parse it first
    if (typeof perguntas === 'string') {
      try {
        const parsed = JSON.parse(perguntas);
        return normalizePerguntas(parsed);
      } catch {
        // If it can't be parsed, treat as a single question
        return [{ key: '0', value: perguntas }];
      }
    }

    return [];
  };

  // Initialize form state when demanda changes
  useEffect(() => {
    if (selectedDemanda?.problema_id) {
      setSelectedProblemId(selectedDemanda.problema_id);
    }
    
    // Initialize perguntas and respostas
    if (selectedDemanda?.perguntas) {
      const normalizedPerguntas = normalizePerguntas(selectedDemanda.perguntas);
      
      const initialRespostas: Record<string, string> = { ...resposta };
      
      normalizedPerguntas.forEach(({ key, value }) => {
        if (!initialRespostas[key]) {
          initialRespostas[key] = '';
        }
      });
      
      console.log('Normalized perguntas:', normalizedPerguntas);
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
    
    const normalizedPerguntas = normalizePerguntas(selectedDemanda.perguntas);
    
    // If there are no questions, consider everything answered
    if (normalizedPerguntas.length === 0) return true;
    
    // Check if all questions have answers
    return normalizedPerguntas.every(({ key }) => resposta[key] && resposta[key].trim() !== '');
  };

  const handleAttachmentAction = (url: string, action: 'view' | 'download') => {
    if (!url.startsWith('http') || url.startsWith('blob:')) {
      toast({
        title: "Erro ao acessar anexo",
        description: "O URL do anexo é inválido ou não está acessível.",
        variant: "destructive"
      });
      return;
    }
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
