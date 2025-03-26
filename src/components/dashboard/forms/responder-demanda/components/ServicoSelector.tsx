
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ServicoSelectorProps {
  selectedServicoId: string;
  servicos: any[];
  servicosLoading: boolean;
  onServicoChange: (value: string) => void;
}

const ServicoSelector: React.FC<ServicoSelectorProps> = ({
  selectedServicoId,
  servicos,
  servicosLoading,
  onServicoChange
}) => {
  return (
    <div>
      <Label htmlFor="servico" className="text-sm font-medium mb-2">Serviço</Label>
      <Select
        value={selectedServicoId}
        onValueChange={onServicoChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um serviço" />
        </SelectTrigger>
        <SelectContent>
          {servicosLoading ? (
            <SelectItem value="loading" disabled>Carregando serviços...</SelectItem>
          ) : servicos.length > 0 ? (
            servicos.map((servico) => (
              <SelectItem key={servico.id} value={servico.id}>
                {servico.descricao}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>Nenhum serviço encontrado</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServicoSelector;
