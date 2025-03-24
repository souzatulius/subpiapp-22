
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface AreaTecnicaFilterProps {
  value: 'STM' | 'STLP' | 'Todos';
  onChange: (value: 'STM' | 'STLP' | 'Todos') => void;
}

const AreaTecnicaFilter: React.FC<AreaTecnicaFilterProps> = ({
  value,
  onChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Área Técnica</label>
      <Select
        value={value}
        onValueChange={onChange as (value: string) => void}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a área técnica" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todas</SelectItem>
          <SelectItem value="STM">STM</SelectItem>
          <SelectItem value="STLP">STLP</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AreaTecnicaFilter;
