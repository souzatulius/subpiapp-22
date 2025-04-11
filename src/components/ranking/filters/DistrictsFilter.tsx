
import React from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

interface DistrictsFilterProps {
  distritos: string[];
  onDistrictsChange: (distritos: string[]) => void;
}

const DistrictsFilter: React.FC<DistrictsFilterProps> = ({ distritos, onDistrictsChange }) => {
  const districtOptions = [
    { value: 'Todos', label: 'Todos os distritos' },
    { value: 'Butantã', label: 'Butantã' },
    { value: 'Pinheiros', label: 'Pinheiros' },
    { value: 'Lapa', label: 'Lapa' },
    { value: 'Sé', label: 'Sé' },
    { value: 'Vila Mariana', label: 'Vila Mariana' },
    { value: 'Santo Amaro', label: 'Santo Amaro' },
    { value: 'Ipiranga', label: 'Ipiranga' },
    { value: 'Moóca', label: 'Moóca' }
  ];

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Distritos</h3>
      <MultiSelect
        placeholder="Selecionar distritos"
        options={districtOptions}
        selected={distritos}
        onChange={onDistrictsChange}
        className="max-w-full"
      />
    </div>
  );
};

export default DistrictsFilter;
