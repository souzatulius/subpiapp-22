import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { normalizeQuestions } from '@/utils/questionFormatUtils';

interface UseRespostaFormStateProps {
  selectedDemanda: any;
  resposta: Record<string, string>;
  setResposta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const useRespostaFormState = ({
  selectedDemanda,
  resposta,
  setResposta,
}: UseRespostaFormStateProps) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(selectedDemanda?.problema_id || null);
  const [selectedServicoId, setSelectedServicoId] = useState<string>(selectedDemanda?.servico_id || '');
  const [dontKnowService, setDontKnowService] = useState<boolean>(!!selectedDemanda?.nao_sabe_servico);
  const [servicos, setServicos] = useState<any[]>([]);
  const [loadingServicos, setLoadingServicos] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProblemId && selectedDemanda?.supervisao_tecnica_id) {
      fetchServicos(selectedDemanda.supervisao_tecnica_id);
    }
  }, [selectedProblemId, selectedDemanda?.supervisao_tecnica_id]);

  useEffect(() => {
    if (selectedDemanda) {
      setSelectedProblemId(selectedDemanda.problema_id || null);
      setSelectedServicoId(selectedDemanda.servico_id || '');
      setDontKnowService(!!selectedDemanda.nao_sabe_servico);
    }
  }, [selectedDemanda]);

  const fetchServicos = async (supervisaoId: string) => {
    try {
      setLoadingServicos(true);
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('supervisao_tecnica_id', supervisaoId)
        .order('descricao', { ascending: true });

      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: 'Erro ao carregar serviços',
        description: 'Não foi possível obter os serviços disponíveis.',
        variant: 'destructive'
      });
    } finally {
      setLoadingServicos(false);
    }
  };

  const handleServiceToggle = () => {
    setDontKnowService(!dontKnowService);
    if (!dontKnowService) {
      setSelectedServicoId('');
    }
  };

  const handleRespostaChange = (index: string, value: string) => {
    setResposta((prev) => ({
      ...prev,
      [index]: value
    }));
  };

  const updateService = async () => {
    if (!selectedDemanda?.id || (!selectedServicoId && !dontKnowService)) return;

    try {
      if ((!selectedDemanda.servico_id || selectedDemanda.nao_sabe_servico) && selectedServicoId) {
        const { error } = await supabase
          .from('demandas')
          .update({
            servico_id: selectedServicoId,
            nao_sabe_servico: false
          })
          .eq('id', selectedDemanda.id);

        if (error) throw error;
        console.log('Serviço atualizado:', selectedServicoId);
      }
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: 'Erro ao atualizar serviço',
        description: 'Não foi possível salvar o serviço da demanda.',
        variant: 'destructive'
      });
    }
  };

  const allQuestionsAnswered = () => {
    const perguntas = normalizeQuestions(selectedDemanda?.perguntas || []);
    if (!Array.isArray(perguntas) || perguntas.length === 0) return true;

    for (let i = 0; i < perguntas.length; i++) {
      if (!resposta[i.toString()]?.trim()) {
        return false;
      }
    }

    if (selectedDemanda?.nao_sabe_servico && !selectedServicoId) return false;

    return true;
  };

  const handleViewAttachment = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadAttachment = (url: string, fileName = 'anexo') => {
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return {
    selectedProblemId,
    selectedServicoId,
    dontKnowService,
    servicos,
    loadingServicos,
    setSelectedProblemId,
    setSelectedServicoId,
    handleServiceToggle,
    handleRespostaChange,
    updateService,
    allQuestionsAnswered,
    handleViewAttachment,
    handleDownloadAttachment
  };
};
