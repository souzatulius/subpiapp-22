
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChartVisibility } from '@/components/ranking/types';

interface ChartVisibilityManagerProps {
  chartVisibility: ChartVisibility;
  onChartVisibilityToggle: (chart: keyof ChartVisibility) => void;
}

const ChartVisibilityManager: React.FC<ChartVisibilityManagerProps> = ({
  chartVisibility,
  onChartVisibilityToggle
}) => {
  const chartOptions = [
    { id: 'occurrences', label: 'Status' },
    { id: 'resolutionTime', label: 'Tempo de Resolução' },
    { id: 'serviceTypes', label: 'Tipos de Serviços' },
    { id: 'neighborhoods', label: 'Distritos' },
    { id: 'frequentServices', label: 'Serviços Frequentes' },
    { id: 'statusDistribution', label: 'Distribuição de Status' },
    { id: 'topCompanies', label: 'Empresas' },
    { id: 'criticalStatus', label: 'Status Críticos' }
  ];
  
  return (
    <div>
      <Label className="mb-2 block">Gerenciamento de Exibição</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {chartOptions.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`chart-${option.id}`} 
              checked={chartVisibility[option.id as keyof ChartVisibility]}
              onCheckedChange={() => onChartVisibilityToggle(option.id as keyof ChartVisibility)}
            />
            <label 
              htmlFor={`chart-${option.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartVisibilityManager;
