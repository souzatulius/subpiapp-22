
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
    if (selectedProblemId) {
      fetchServicos(selectedProblemId);
    }
  }, [selectedProblemId]);

  useEffect(() => {
    if (selectedDemanda) {
      setSelectedProblemId(selectedDemanda.problema_id || null);
      setSelectedServicoId(selectedDemanda.servico_id || '');
      setDontKnowService(!!selectedDemanda.nao_sabe_servico);
    }
  }, [selectedDemanda]);

  const fetchServicos = async (problemaId: string) => {
    try {
      setLoadingServicos(true);
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('supervisao_tecnica_id', selectedDemanda?.supervisao_tecnica_id)
        .order('descricao', { ascending: true });

      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: 'Erro ao carregar serviços',
        description: 'Ocorreu um erro ao carregar a lista de serviços.',
        variant: 'destructive'
      });
    } finally {
      setLoadingServicos(false);
    }
  };

  const handleServiceToggle = () => {
    setDontKnowService(!dontKnowService);
    if (dontKnowService) {
      setSelectedServicoId('');
    }
  };

  const handleRespostaChange = (index: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const updateService = async () => {
    if (!selectedDemanda || (!selectedServicoId && !dontKnowService)) {
      return;
    }

    try {
      // Só atualize o serviço se a demanda não tiver um serviço ou se "não sei informar" estava marcado
      if ((!selectedDemanda.servico_id || selectedDemanda.nao_sabe_servico) && selectedServicoId) {
        const { error } = await supabase
          .from('demandas')
          .update({
            servico_id: selectedServicoId,
            nao_sabe_servico: false
          })
          .eq('id', selectedDemanda.id);

        if (error) throw error;
        
        console.log('Serviço atualizado com sucesso:', selectedServicoId);
      }
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: 'Erro ao atualizar serviço',
        description: 'Não foi possível atualizar o serviço da demanda.',
        variant: 'destructive'
      });
    }
  };

  const allQuestionsAnswered = () => {
    if (!selectedDemanda?.perguntas) return true;
    
    const questions = Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas 
      : Object.values(selectedDemanda.perguntas);
    
    // Se não há perguntas, considere como respondidas
    if (questions.length === 0) return true;
    
    // Verifica se todas as perguntas têm respostas
    for (let i = 0; i < questions.length; i++) {
      if (!resposta[i.toString()] || resposta[i.toString()].trim() === '') {
        return false;
      }
    }
    
    // Se a demanda foi cadastrada sem serviço e ainda não foi selecionado um serviço
    if (selectedDemanda.nao_sabe_servico && !selectedServicoId) {
      return false;
    }
    
    return true;
  };

  const handleViewAttachment = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadAttachment = (url: string, fileName: string = 'download') => {
    // Cria um link temporário para download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
