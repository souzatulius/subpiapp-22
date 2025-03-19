
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationStepProps {
  formData: {
    endereco: string;
    bairro_id: string;
  };
  selectedDistrito: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  setSelectedDistrito: (value: string) => void;
  distritos: any[];
  filteredBairros: any[];
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  selectedDistrito,
  handleChange,
  handleSelectChange,
  setSelectedDistrito,
  distritos,
  filteredBairros
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="endereco">Endereço</Label>
        <Input 
          id="endereco" 
          name="endereco" 
          value={formData.endereco} 
          onChange={handleChange} 
        />
      </div>
      
      <div>
        <Label htmlFor="distrito">Distrito</Label>
        <Select value={selectedDistrito} onValueChange={setSelectedDistrito}>
          <SelectTrigger className="rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {distritos.map(distrito => (
              <SelectItem key={distrito.id} value={distrito.id}>
                {distrito.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="bairro_id">Bairro</Label>
        <Select 
          value={formData.bairro_id} 
          onValueChange={value => handleSelectChange('bairro_id', value)} 
          disabled={!selectedDistrito}
        >
          <SelectTrigger className="rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filteredBairros.map(bairro => (
              <SelectItem key={bairro.id} value={bairro.id}>
                {bairro.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationStep;
