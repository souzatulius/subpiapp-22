
import React from 'react';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import OccurrencesChart from './charts/OccurrencesChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import ResolutionTimeChart from './charts/ResolutionTimeChart';
import NeighborhoodsChart from './charts/NeighborhoodsChart';
import FrequentServicesChart from './charts/FrequentServicesChart';
import StatusDistributionChart from './charts/StatusDistributionChart';

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
      
      {/* Gráfico 3: Tempo de Resolução */}
      {chartVisibility.resolutionTime && (
        <ResolutionTimeChart 
          data={chartData?.resolutionTime} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 4: Distribuição por Bairros */}
      {chartVisibility.neighborhoods && (
        <NeighborhoodsChart 
          data={chartData?.neighborhoods} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 5: Serviços Frequentes */}
      {chartVisibility.frequentServices && (
        <FrequentServicesChart 
          data={chartData?.frequentServices} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 6: Status */}
      {chartVisibility.statusDistribution && (
        <StatusDistributionChart 
          data={chartData?.statusDistribution} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default ChartsSection;
