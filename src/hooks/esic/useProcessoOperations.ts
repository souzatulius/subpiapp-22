
import { ESICProcessoFormValues } from '@/types/esic';
import { useToast } from '@/components/ui/use-toast';

export const useProcessoOperations = (
  updateProcesso: (params: { id: string; data: any }, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => void,
  setSelectedProcesso: (processo: any) => void
) => {
  const { toast } = useToast();

  const handleUpdateStatus = (status: 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao' | 'concluido') => {
    return (processoId: string) => {
      if (!processoId) return;
      
      updateProcesso(
        {
          id: processoId,
          data: { status }
        },
        {
          onSuccess: () => {
            toast({
              title: 'Status atualizado',
              description: `O status do processo foi alterado.`,
            });
            setSelectedProcesso(prev => prev ? { ...prev, status } : null);
          },
        }
      );
    };
  };

  const handleUpdateSituacao = (situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido') => {
    return (processoId: string) => {
      if (!processoId) return;
      
      updateProcesso(
        {
          id: processoId,
          data: { situacao }
        },
        {
          onSuccess: () => {
            toast({
              title: 'Situação atualizada',
              description: `A situação do processo foi alterada.`,
            });
            setSelectedProcesso(prev => prev ? { ...prev, situacao } : null);
          },
        }
      );
    };
  };

  const handleUpdateProcesso = async (id: string, values: ESICProcessoFormValues): Promise<void> => {
    if (!id) return Promise.reject(new Error('Nenhum processo selecionado'));
    
    return new Promise((resolve, reject) => {
      updateProcesso(
        { 
          id, 
          data: {
            data_processo: values.data_processo.toISOString(),
            situacao: values.situacao,
            texto: values.texto,
            assunto: values.assunto,
            solicitante: values.solicitante,
            coordenacao_id: values.coordenacao_id,
            prazo_resposta: values.prazo_resposta ? new Date(values.prazo_resposta).toISOString() : undefined
          } 
        },
        {
          onSuccess: () => {
            toast({
              title: 'Processo atualizado com sucesso',
              description: 'As alterações foram salvas no sistema.',
            });
            resolve();
          },
          onError: (error) => {
            reject(error);
          }
        }
      );
    });
  };

  return {
    handleUpdateStatus,
    handleUpdateSituacao,
    handleUpdateProcesso
  };
};
