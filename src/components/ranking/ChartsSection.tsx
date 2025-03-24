
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ChartVisibility, ChartCard } from './types';
import NoDataMessage from './charts/NoDataMessage';
import OccurrencesChart from './charts/OccurrencesChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import ResolutionTimeChart from './charts/ResolutionTimeChart';
import NeighborhoodsChart from './charts/NeighborhoodsChart';
import FrequentServicesChart from './charts/FrequentServicesChart';
import StatusDistributionChart from './charts/StatusDistributionChart';
import StatusTimelineChart from './charts/StatusTimelineChart';
import TimeToCloseChart from './charts/TimeToCloseChart';
import EfficiencyRadarChart from './charts/EfficiencyRadarChart';
import CriticalStatusChart from './charts/CriticalStatusChart';
import ExternalDistrictsChart from './charts/ExternalDistrictsChart';
import ServicesDiversityChart from './charts/ServicesDiversityChart';
import CompaniesPerformanceChart from './charts/CompaniesPerformanceChart';
import AreaServicesChart from './charts/AreaServicesChart';
import DailyOrdersChart from './charts/DailyOrdersChart';

// Import chart registration
import './charts/ChartRegistration';

interface ChartsSectionProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
  visibleCharts: ChartCard[];
  onToggleVisibility: (chartId: string) => void;
  lastUpdated?: string | null;
}

// Sortable chart card component
const SortableChartCard = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div 
        className="absolute top-4 right-12 z-10 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      </div>
      {children}
    </div>
  );
};

const ChartsSection: React.FC<ChartsSectionProps> = ({
  chartData,
  isLoading,
  chartVisibility,
  visibleCharts,
  onToggleVisibility,
  lastUpdated
}) => {
  if (!chartData && !isLoading) {
    return <NoDataMessage />;
  }

  // Helper to check if a chart is visible
  const isChartVisible = (chartId: string): boolean => {
    const chart = visibleCharts.find(c => c.id === chartId);
    return chart ? chart.visible : true;
  };

  // Add toggle visibility button to chart
  const withVisibilityToggle = (chartId: string, chart: React.ReactNode) => {
    const visible = isChartVisible(chartId);
    
    return (
      <div className="relative">
        {chart}
        <button
          onClick={() => onToggleVisibility(chartId)}
          className="absolute top-4 right-4 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
          aria-label={visible ? "Ocultar gráfico" : "Mostrar gráfico"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4 text-gray-600" />
          ) : (
            <Eye className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>
    );
  };

  // Get visible charts in their sorted order
  const getSortedVisibleCharts = () => {
    return [...visibleCharts]
      .sort((a, b) => a.order - b.order)
      .filter(chart => chart.visible);
  };

  // Helper to render a chart based on its ID
  const renderChart = (chartId: string) => {
    switch (chartId) {
      case 'status-distribution':
        return (
          <StatusDistributionChart 
            data={chartData?.statusDistribution} 
            isLoading={isLoading} 
          />
        );
      case 'resolution-time':
        return (
          <ResolutionTimeChart 
            data={chartData?.averageTimeByStatus} 
            isLoading={isLoading} 
          />
        );
      case 'companies-performance':
        return (
          <CompaniesPerformanceChart 
            data={chartData?.companiesPerformance} 
            isLoading={isLoading} 
          />
        );
      case 'daily-orders':
        return (
          <DailyOrdersChart 
            data={chartData?.dailyNewOrders} 
            isLoading={isLoading} 
          />
        );
      case 'time-to-close':
        return (
          <TimeToCloseChart 
            data={chartData?.timeToCompletion} 
            isLoading={isLoading} 
          />
        );
      case 'efficiency-score':
        return (
          <StatusDistributionChart 
            data={chartData?.efficiencyScore} 
            isLoading={isLoading}
            title="Pontuação de Eficiência" 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {lastUpdated && (
        <div className="text-sm font-medium text-orange-600 border-b pb-2">
          Última atualização: {lastUpdated}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getSortedVisibleCharts().map((chart) => (
          <SortableChartCard key={chart.id} id={chart.id}>
            {withVisibilityToggle(chart.id, renderChart(chart.id))}
          </SortableChartCard>
        ))}
      </div>
      
      {visibleCharts.filter(c => !c.visible).length > 0 && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Gráficos Ocultos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
            {visibleCharts
              .filter(chart => !chart.visible)
              .map((chart) => (
                <div key={chart.id} className="relative">
                  {withVisibilityToggle(chart.id, renderChart(chart.id))}
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Additional information section */}
      <div className="p-4 border border-orange-200 rounded-md bg-orange-50 text-sm text-gray-800 mt-8">
        <h3 className="font-medium text-orange-800 mb-2">Dicas para visualização</h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <span className="font-medium">Reorganização:</span> Arraste os gráficos para reordená-los conforme sua preferência.
          </li>
          <li>
            <span className="font-medium">Visibilidade:</span> Use o botão com ícone de olho para ocultar/mostrar gráficos.
          </li>
          <li>
            <span className="font-medium">Salvamento:</span> As configurações são salvas automaticamente após o upload de novas planilhas.
          </li>
          <li>
            <span className="font-medium">Filtros:</span> Aplique filtros na aba "Filtros" para visualizar dados específicos.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChartsSection;
