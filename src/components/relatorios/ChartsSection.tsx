
import React from 'react';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import DistrictDistributionChart from './charts/DistrictDistributionChart';
import NeighborhoodDistributionChart from './charts/NeighborhoodDistributionChart';
import DemandOriginChart from './charts/DemandOriginChart';
import MediaTypesChart from './charts/MediaTypesChart';
import ResponseTimeChart from './charts/ResponseTimeChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import CoordinationAreasChart from './charts/CoordinationAreasChart';
import StatusDistributionChart from './charts/StatusDistributionChart';
import ResponsibleUsersChart from './charts/ResponsibleUsersChart';
import NoteApprovalsChart from './charts/NoteApprovalsChart';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 charts-section">
      {/* Gráfico 1: Distribuição das Solicitações por Distrito */}
      {chartVisibility.districtDistribution && (
        <DistrictDistributionChart 
          data={chartData?.districtDistribution} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 2: Distribuição das Solicitações por Bairro */}
      {chartVisibility.neighborhoodDistribution && (
        <NeighborhoodDistributionChart 
          data={chartData?.neighborhoodDistribution} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 3: Origem da Demanda */}
      {chartVisibility.demandOrigin && (
        <DemandOriginChart 
          data={chartData?.demandOrigin} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 4: Tipos de Mídia Mais Demandantes */}
      {chartVisibility.mediaTypes && (
        <MediaTypesChart 
          data={chartData?.mediaTypes} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 5: Tempo Médio de Resposta das Solicitações */}
      {chartVisibility.responseTime && (
        <ResponseTimeChart 
          data={chartData?.responseTime} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 6: Principais Problemas ou Serviços Solicitados */}
      {chartVisibility.serviceTypes && (
        <ServiceTypesChart 
          data={chartData?.serviceTypes} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 7: Áreas de Coordenação Mais Acionadas */}
      {chartVisibility.coordinationAreas && (
        <CoordinationAreasChart 
          data={chartData?.coordinationAreas} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 8: Solicitações Pendentes x Concluídas */}
      {chartVisibility.statusDistribution && (
        <StatusDistributionChart 
          data={chartData?.statusDistribution} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 9: Responsáveis pelo Atendimento */}
      {chartVisibility.responsibleUsers && (
        <ResponsibleUsersChart 
          data={chartData?.responsibleUsers} 
          isLoading={isLoading} 
        />
      )}
      
      {/* Gráfico 10: Aprovações da Nota Oficial */}
      {chartVisibility.noteApprovals && (
        <NoteApprovalsChart 
          data={chartData?.noteApprovals} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default ChartsSection;
