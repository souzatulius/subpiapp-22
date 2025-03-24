
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartVisibility } from './types';
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
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  chartData,
  isLoading,
  chartVisibility
}) => {
  if (!chartData && !isLoading) {
    return <NoDataMessage />;
  }

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
        <TabsTrigger value="summary">Resumo</TabsTrigger>
        <TabsTrigger value="timing">Tempo de Atendimento</TabsTrigger>
        <TabsTrigger value="distribution">Distribuição</TabsTrigger>
        <TabsTrigger value="trends">Tendências</TabsTrigger>
        <TabsTrigger value="critical">Status Críticos</TabsTrigger>
        <TabsTrigger value="efficiency">Eficiência</TabsTrigger>
      </TabsList>
      
      {/* Summary Tab - Key Metrics */}
      <TabsContent value="summary" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico 1: Distribuição de Ocorrências */}
          {chartVisibility.occurrences && (
            <OccurrencesChart 
              data={chartData?.occurrences} 
              isLoading={isLoading} 
            />
          )}
          
          {/* Gráfico 2: Tipos de Serviços */}
          {chartVisibility.serviceTypes && (
            <ServiceTypesChart 
              data={chartData?.serviceTypes} 
              isLoading={isLoading} 
            />
          )}
          
          {/* Gráfico 3: Status */}
          {chartVisibility.statusDistribution && (
            <StatusDistributionChart 
              data={chartData?.statusDistribution} 
              isLoading={isLoading} 
            />
          )}
          
          {/* Gráfico 4: Serviços por Área Técnica */}
          {chartVisibility.servicesDiversity && (
            <AreaServicesChart
              data={chartData?.servicesByTechnicalArea}
              isLoading={isLoading}
            />
          )}
        </div>
      </TabsContent>
      
      {/* Timing Tab - Time-based Metrics */}
      <TabsContent value="timing" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico: Tempo de Resolução */}
          {chartVisibility.resolutionTime && (
            <ResolutionTimeChart 
              data={chartData?.resolutionTime} 
              isLoading={isLoading} 
            />
          )}
          
          {/* Gráfico: Comparativo Tempo até Fechamento */}
          {chartVisibility.timeToClose && (
            <TimeToCloseChart
              data={chartData?.timeToCompletion}
              isLoading={isLoading}
            />
          )}
          
          {/* Gráfico: Tempo Médio por Status */}
          <ResolutionTimeChart 
            data={chartData?.averageTimeByStatus} 
            isLoading={isLoading} 
          />
          
          {/* Gráfico: Volume Diário */}
          {chartVisibility.dailyOrders && (
            <DailyOrdersChart
              data={chartData?.dailyNewOrders}
              isLoading={isLoading}
            />
          )}
        </div>
      </TabsContent>
      
      {/* Distribution Tab - Geographical & Service Distribution */}
      <TabsContent value="distribution" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico: Distribuição por Bairros */}
          {chartVisibility.neighborhoods && (
            <NeighborhoodsChart 
              data={chartData?.neighborhoods} 
              isLoading={isLoading} 
            />
          )}
          
          {/* Gráfico: Serviços Frequentes */}
          {chartVisibility.frequentServices && (
            <FrequentServicesChart 
              data={chartData?.frequentServices} 
              isLoading={isLoading} 
            />
          )}
          
          {/* Gráfico: Serviços por Distrito */}
          <NeighborhoodsChart 
            data={chartData?.servicesByDistrict} 
            isLoading={isLoading}
            title="Serviços por Distrito" 
          />
          
          {/* Gráfico: Diversidade de Serviços */}
          {chartVisibility.servicesDiversity && (
            <ServicesDiversityChart
              data={chartData?.servicesDiversity}
              isLoading={isLoading}
            />
          )}
        </div>
      </TabsContent>
      
      {/* Trends Tab - Timeline Charts */}
      <TabsContent value="trends" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico: Evolução Temporal por Status */}
          {chartVisibility.statusTimeline && (
            <StatusTimelineChart
              data={chartData?.statusTimeline}
              isLoading={isLoading}
            />
          )}
          
          {/* Gráfico: Desempenho de Empresas */}
          {chartVisibility.externalDistricts && (
            <CompaniesPerformanceChart
              data={chartData?.companiesPerformance}
              isLoading={isLoading}
            />
          )}
        </div>
      </TabsContent>
      
      {/* Critical Status Tab */}
      <TabsContent value="critical" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico: Status Críticos */}
          {chartVisibility.criticalStatus && (
            <CriticalStatusChart
              data={chartData?.criticalStatusAnalysis}
              isLoading={isLoading}
            />
          )}
          
          {/* Gráfico: Distritos Externos */}
          {chartVisibility.externalDistricts && (
            <ExternalDistrictsChart
              data={chartData?.externalDistrictsAnalysis}
              isLoading={isLoading}
            />
          )}
        </div>
      </TabsContent>
      
      {/* Efficiency Tab */}
      <TabsContent value="efficiency" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico: Radar de Eficiência */}
          {chartVisibility.efficiencyRadar && (
            <EfficiencyRadarChart
              data={chartData?.efficiencyRadar}
              isLoading={isLoading}
            />
          )}
          
          {/* Gráfico: Pontuação de Eficiência */}
          <CompaniesPerformanceChart
            data={chartData?.efficiencyScore}
            isLoading={isLoading}
            title="Pontuação de Eficiência"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ChartsSection;
