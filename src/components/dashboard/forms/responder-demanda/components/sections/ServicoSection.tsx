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

     import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ServicoSelectorProps {
  selectedServicoId: string;
  servicos: any[];
  servicosLoading: boolean;
  onServicoChange: (id: string) => void;
}

const ServicoSelector: React.FC<ServicoSelectorProps> = ({
  selectedServicoId,
  servicos,
  servicosLoading,
  onServicoChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServicos = useMemo(() => {
    return servicos.filter(servico =>
      servico.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [servicos, searchTerm]);

  if (servicosLoading) {
    return (
      <div className="flex items-center justify-center p-3 border rounded-md bg-white">
        <Loader2 className="w-5 h-5 text-subpi-blue animate-spin" />
        <span className="ml-2 text-sm text-gray-600">Carregando serviços...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Buscar serviço..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md bg-white"
      />

      <Select 
        value={selectedServicoId} 
        onValueChange={onServicoChange}
      >
        <SelectTrigger className="w-full h-auto p-3 border rounded-md bg-white">
          <SelectValue placeholder="Selecione um serviço" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          {filteredServicos.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              Nenhum serviço encontrado
            </div>
          ) : (
            filteredServicos.map(servico => (
              <SelectItem key={servico.id} value={servico.id}>
                {servico.descricao}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServicoSelector;

      />
    </section>
  );
};

export default ServicoSection;
