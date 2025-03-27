// ServicoSection.tsx (componente mais completo e inteligente)
import React from 'react';
import ServicoSelector from './ServicoSelector';
import { Alert, AlertTriangle } from 'lucide-react';

interface ServicoSectionProps {
  selectedDemanda: any;
  servicos: any[];
  servicosLoading: boolean;
  selectedServicoId: string;
  onServicoChange: (id: string) => void;
}

const ServicoSection: React.FC<ServicoSectionProps> = ({
  selectedDemanda,
  servicos,
  servicosLoading,
  selectedServicoId,
  onServicoChange,
}) => {
  const servicoNaoInformado = selectedDemanda.nao_sabe_servico && !selectedServicoId;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-subpi-blue">Serviço</h2>

      {servicoNaoInformado && (
        <div className="bg-orange-100 p-3 rounded-lg flex gap-2 items-center">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span className="text-sm text-orange-800">
            Esta demanda não possui serviço informado. Por favor, selecione um serviço antes de responder.
          </span>
        </div>
      )}

      <ServicoSelector
        selectedServicoId={selectedServicoId}
        servicos={servicos}
        servicosLoading={servicosLoading}
        onServicoChange={onServicoChange}
      />
    </section>
  );
};

export default ServicoSection;
