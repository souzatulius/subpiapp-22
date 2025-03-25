
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
    { id: 'statusDistribution', label: 'Distribuição por Status' },
    { id: 'resolutionTime', label: 'Tempo de Resolução' },
    { id: 'topCompanies', label: 'Empresas com Ordens Concluídas' },
    { id: 'districtDistribution', label: 'Ordens por Subprefeitura' },
    { id: 'servicesByDepartment', label: 'Serviços por Departamento' },
    { id: 'servicesByDistrict', label: 'Serviços por Distrito' },
    { id: 'timeComparison', label: 'Comparativo de Tempo Médio' },
    { id: 'efficiencyImpact', label: 'Impacto na Eficiência' },
    { id: 'dailyDemands', label: 'Volume Diário' },
    { id: 'neighborhoodComparison', label: 'Comparativo por Bairros' },
    { id: 'districtEfficiencyRadar', label: 'Radar de Eficiência' },
    { id: 'statusTransition', label: 'Transição de Status' },
    { id: 'criticalStatus', label: 'Status Críticos' },
    { id: 'externalDistricts', label: 'Distritos Externos' },
    { id: 'serviceDiversity', label: 'Diversidade de Serviços' },
    { id: 'closureTime', label: 'Tempo até Fechamento' }
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
