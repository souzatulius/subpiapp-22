
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChartVisibility } from '@/components/relatorios/types';

interface ChartVisibilityManagerProps {
  chartVisibility: ChartVisibility;
  onChartVisibilityToggle: (chart: keyof ChartVisibility) => void;
}

const ChartVisibilityManager: React.FC<ChartVisibilityManagerProps> = ({
  chartVisibility,
  onChartVisibilityToggle
}) => {
  const chartOptions = [
    { id: 'districtDistribution', label: 'Distribuição por Distrito' },
    { id: 'neighborhoodDistribution', label: 'Distribuição por Bairro' },
    { id: 'demandOrigin', label: 'Origem da Demanda' },
    { id: 'mediaTypes', label: 'Tipos de Mídia' },
    { id: 'responseTime', label: 'Tempo de Resposta' },
    { id: 'serviceTypes', label: 'Tipos de Serviço' },
    { id: 'coordinationAreas', label: 'Áreas de Coordenação' },
    { id: 'statusDistribution', label: 'Status das Solicitações' },
    { id: 'responsibleUsers', label: 'Responsáveis pelo Atendimento' },
    { id: 'noteApprovals', label: 'Aprovações de Notas' }
  ];
  
  return (
    <div>
      <Label className="mb-2 block">Gerenciamento de Exibição</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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
