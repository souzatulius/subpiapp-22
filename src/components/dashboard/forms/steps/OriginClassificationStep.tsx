
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OriginClassificationStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  origens: any[];
  tiposMidia: any[];
}

const OriginClassificationStep: React.FC<OriginClassificationStepProps> = ({
  formData,
  handleSelectChange,
  origens,
  tiposMidia
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="origem_id">Origem da Demanda</Label>
        <Select value={formData.origem_id} onValueChange={value => handleSelectChange('origem_id', value)}>
          <SelectTrigger className="rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {origens.map(origem => (
              <SelectItem key={origem.id} value={origem.id}>
                {origem.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="tipo_midia_id">Tipo de Mídia</Label>
        <Select value={formData.tipo_midia_id} onValueChange={value => handleSelectChange('tipo_midia_id', value)}>
          <SelectTrigger className="rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tiposMidia.map(tipo => (
              <SelectItem key={tipo.id} value={tipo.id}>
                {tipo.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OriginClassificationStep;
