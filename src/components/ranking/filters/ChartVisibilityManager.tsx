
import React from 'react';
import { ChartVisibility } from '@/components/ranking/types';
import { BarChart, Clock, MapPin, LineChart, TrendingUp, AlertCircle } from 'lucide-react';
import ChartCategorySection from '../ChartCategorySection';

interface ChartVisibilityManagerProps {
  chartVisibility: ChartVisibility;
  onChartVisibilityToggle: (chart: keyof ChartVisibility) => void;
}

const ChartVisibilityManager: React.FC<ChartVisibilityManagerProps> = ({
  chartVisibility,
  onChartVisibilityToggle
}) => {
  // Category 1: Indicadores Gerais
  const generalCharts = [
    { id: 'statusDistribution', label: 'Distribuição por Status' },
    { id: 'topCompanies', label: 'Empresas com Ordens Concluídas' },
    { id: 'districtDistribution', label: 'Ordens por Subprefeitura' },
    { id: 'servicesByDepartment', label: 'Serviços por Departamento' },
    { id: 'servicesByDistrict', label: 'Serviços por Distrito' },
  ];
  
  // Category 2: Indicadores Temporais
  const timeCharts = [
    { id: 'resolutionTime', label: 'Tempo de Resolução' },
    { id: 'timeComparison', label: 'Comparativo de Tempo Médio' },
    { id: 'dailyDemands', label: 'Volume Diário' },
    { id: 'statusTransition', label: 'Transição de Status' },
    { id: 'closureTime', label: 'Tempo até Fechamento' },
  ];
  
  // Category 3: Análise por Território
  const territoryCharts = [
    { id: 'neighborhoodComparison', label: 'Comparativo por Bairros' },
    { id: 'districtEfficiencyRadar', label: 'Radar de Eficiência' },
    { id: 'externalDistricts', label: 'Distritos Externos' },
  ];
  
  // Category 4: Eficiência de Atendimento
  const efficiencyCharts = [
    { id: 'efficiencyImpact', label: 'Impacto na Eficiência' },
    { id: 'criticalStatus', label: 'Status Críticos' },
    { id: 'serviceDiversity', label: 'Diversidade de Serviços' },
  ];
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-orange-700 mb-4">Gerenciamento de Gráficos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCategorySection
          title="Indicadores Gerais"
          description="Visão geral da distribuição de ordens de serviço"
          icon={<BarChart className="h-5 w-5 text-orange-600" />}
          color="border-orange-200"
          chartVisibility={chartVisibility}
          onChartVisibilityToggle={onChartVisibilityToggle}
          charts={generalCharts}
        />
        
        <ChartCategorySection
          title="Indicadores Temporais"
          description="Análise de prazos e tempos de atendimento"
          icon={<Clock className="h-5 w-5 text-orange-600" />}
          color="border-orange-200"
          chartVisibility={chartVisibility}
          onChartVisibilityToggle={onChartVisibilityToggle}
          charts={timeCharts}
        />
        
        <ChartCategorySection
          title="Análise por Território"
          description="Informações territoriais e geográficas"
          icon={<MapPin className="h-5 w-5 text-orange-600" />}
          color="border-orange-200"
          chartVisibility={chartVisibility}
          onChartVisibilityToggle={onChartVisibilityToggle}
          charts={territoryCharts}
        />
        
        <ChartCategorySection
          title="Eficiência de Atendimento"
          description="Métricas de desempenho operacional"
          icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
          color="border-orange-200"
          chartVisibility={chartVisibility}
          onChartVisibilityToggle={onChartVisibilityToggle}
          charts={efficiencyCharts}
        />
      </div>
    </div>
  );
};

export default ChartVisibilityManager;
