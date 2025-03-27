
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

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
  if (servicosLoading) {
    return (
      <div className="flex items-center justify-center p-3 border rounded-md bg-white">
        <Loader2 className="w-5 h-5 text-subpi-blue animate-spin" />
        <span className="ml-2 text-sm text-gray-600">Carregando serviços...</span>
      </div>
    );
  }

  return (
    <Select 
      value={selectedServicoId} 
      onValueChange={onServicoChange}
    >
      <SelectTrigger className="w-full h-auto p-3 border rounded-md bg-white">
        <SelectValue placeholder="Selecione um serviço" />
      </SelectTrigger>
      <SelectContent>
        {servicos.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">Nenhum serviço disponível</div>
        ) : (
          servicos.map(servico => (
            <SelectItem key={servico.id} value={servico.id}>
              {servico.descricao}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default ServicoSelector;
