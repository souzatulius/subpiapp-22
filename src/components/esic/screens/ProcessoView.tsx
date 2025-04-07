
import React from 'react';
import { ESICProcesso, ESICJustificativa } from '@/types/esic';
import ProcessoDetails from '@/components/esic/ProcessoDetails';

interface ProcessoViewProps {
  processo: ESICProcesso;
  justificativas: ESICJustificativa[] | undefined;
  isJustificativasLoading: boolean;
  onBack: () => void;
  onEdit: (processo: ESICProcesso) => void;
  onAddJustificativa: () => void;
  onUpdateStatus: (status: 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao' | 'concluido') => void;
  onUpdateSituacao: (situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido') => void;
}

const ProcessoView: React.FC<ProcessoViewProps> = ({
  processo,
  justificativas,
  isJustificativasLoading,
  onBack,
  onEdit,
  onAddJustificativa,
  onUpdateStatus,
  onUpdateSituacao
}) => {
  return (
    <ProcessoDetails 
      processo={processo}
      justificativas={justificativas}
      onBack={onBack}
      onEdit={onEdit}
      onAddJustificativa={onAddJustificativa}
      onUpdateStatus={onUpdateStatus}
      onUpdateSituacao={onUpdateSituacao}
      isJustificativasLoading={isJustificativasLoading}
    />
  );
};

export default ProcessoView;
