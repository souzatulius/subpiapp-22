
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';

type UpdateProcessoFunc = (params: { id: string; data: any }, options?: any) => Promise<any>;

export const useProcessoOperations = (
  updateProcesso: UpdateProcessoFunc,
  setSelectedProcesso: (processo: ESICProcesso | null) => void,
) => {
  // Update processo handler with detailed form values
  const handleUpdateProcesso = async (id: string, values: ESICProcessoFormValues): Promise<void> => {
    try {
      const updatedData = {
        assunto: values.assunto,
        solicitante: values.solicitante,
        situacao: values.situacao,
        texto: values.texto,
        data_processo: values.data_processo instanceof Date 
          ? values.data_processo.toISOString().split('T')[0]
          : values.data_processo,
        prazo_resposta: values.prazo_resposta instanceof Date 
          ? values.prazo_resposta.toISOString().split('T')[0]
          : values.prazo_resposta,
        coordenacao_id: values.coordenacao_id === 'none' ? null : values.coordenacao_id,
      };
      
      const result = await updateProcesso({ id, data: updatedData });
      
      if (result) {
        setSelectedProcesso(result);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating processo:", error);
      return Promise.reject(error);
    }
  };

  // Status update handler
  const handleUpdateStatus = (status: 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao' | 'concluido') => {
    return async (processoId: string): Promise<void> => {
      try {
        const result = await updateProcesso({
          id: processoId,
          data: { status }
        });
        
        if (result) {
          setSelectedProcesso(result);
        }
        
        return Promise.resolve();
      } catch (error) {
        console.error("Error updating status:", error);
        return Promise.reject(error);
      }
    };
  };

  // Situacao update handler
  const handleUpdateSituacao = (situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido') => {
    return async (processoId: string): Promise<void> => {
      try {
        const result = await updateProcesso({
          id: processoId,
          data: { situacao }
        });
        
        if (result) {
          setSelectedProcesso(result);
        }
        
        return Promise.resolve();
      } catch (error) {
        console.error("Error updating situacao:", error);
        return Promise.reject(error);
      }
    };
  };

  return {
    handleUpdateProcesso,
    handleUpdateStatus,
    handleUpdateSituacao
  };
};
