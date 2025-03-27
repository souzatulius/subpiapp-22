
import React from 'react';
import ServicoSelector from './ServicoSelector';
import { AlertTriangle } from 'lucide-react';
import { useServicosData } from '@/hooks/demandForm/useServicosData';

interface ServicoSectionProps {
  selectedDemanda: any;
  selectedServicoId: string;
  onServicoChange: (id: string) => void;
}

const ServicoSection: React.FC<ServicoSectionProps> = ({
  selectedDemanda,
  selectedServicoId,
  onServicoChange,
}) => {
  // Use our custom hook to fetch services data
  const { servicos, isLoading: servicosLoading, error } = useServicosData();
  
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
        servicos={servicos || []}
        servicosLoading={servicosLoading}
        onServicoChange={onServicoChange}
      />
    </section>
  );
};

export default ServicoSection;
