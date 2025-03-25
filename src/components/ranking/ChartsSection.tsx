
import React from 'react';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import OccurrencesChart from './charts/OccurrencesChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import ResolutionTimeChart from './charts/ResolutionTimeChart';
import NeighborhoodsChart from './charts/NeighborhoodsChart';
import FrequentServicesChart from './charts/FrequentServicesChart';
import StatusDistributionChart from './charts/StatusDistributionChart';
import TopCompaniesChart from './charts/TopCompaniesChart';
import CriticalStatusChart from './charts/CriticalStatusChart';

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
      {/* Gráfico 1: Distribuição por Status */}
      {chartVisibility.occurrences && (
        <StatusDistributionChart 
          data={chartData?.statusDistribution} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 2: Tempo de Resolução */}
      {chartVisibility.resolutionTime && (
        <ResolutionTimeChart 
          data={chartData?.resolutionTime} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 3: Empresas com mais ordens concluídas */}
      {chartVisibility.topCompanies && (
        <TopCompaniesChart 
          data={chartData?.topCompanies} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 4: Distribuição por Distrito */}
      {chartVisibility.neighborhoods && (
        <NeighborhoodsChart 
          data={chartData?.districtDistribution} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 5: Serviços por Departamento Técnico */}
      {chartVisibility.serviceTypes && (
        <ServiceTypesChart 
          data={chartData?.servicesByDepartment} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 6: Status Críticos */}
      {chartVisibility.criticalStatus && (
        <CriticalStatusChart 
          data={chartData?.criticalStatus} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default ChartsSection;
