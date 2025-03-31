
import React from 'react';
import { Demanda } from '../types';
import { AlertTriangle } from 'lucide-react';

interface DemandaReplyAlertProps {
  demanda: Demanda;
}

const DemandaReplyAlert: React.FC<DemandaReplyAlertProps> = ({ demanda }) => {
  // Only show for high priority demands
  if (demanda.prioridade !== 'alta') return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md flex items-start gap-2 mb-2">
      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-yellow-800">
          Esta é uma demanda de alta prioridade. Recomenda-se atenção especial na resposta.
        </p>
      </div>
    </div>
  );
};

export default DemandaReplyAlert;
