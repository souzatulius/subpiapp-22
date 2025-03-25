
import React from 'react';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import StatusDistributionChart from './charts/StatusDistributionChart';
import ResolutionTimeChart from './charts/ResolutionTimeChart';
import TopCompaniesChart from './charts/TopCompaniesChart';
import NeighborhoodsChart from './charts/NeighborhoodsChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import ServicesByDistrictChart from './charts/ServicesByDistrictChart';
import TimeComparisonChart from './charts/TimeComparisonChart';
import EfficiencyImpactChart from './charts/EfficiencyImpactChart';
import DailyDemandsChart from './charts/DailyDemandsChart';
import NeighborhoodComparisonChart from './charts/NeighborhoodComparisonChart';
import DistrictEfficiencyRadarChart from './charts/DistrictEfficiencyRadarChart';
import StatusTransitionChart from './charts/StatusTransitionChart';
import CriticalStatusChart from './charts/CriticalStatusChart';
import ExternalDistrictsChart from './charts/ExternalDistrictsChart';
import ServiceDiversityChart from './charts/ServiceDiversityChart';
import ClosureTimeChart from './charts/ClosureTimeChart';

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
      {/* 1. Status Distribution */}
      {chartVisibility.statusDistribution && (
        <StatusDistributionChart 
          data={chartData?.statusDistribution} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 2. Resolution Time */}
      {chartVisibility.resolutionTime && (
        <ResolutionTimeChart 
          data={chartData?.resolutionTime} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 3. Top Companies */}
      {chartVisibility.topCompanies && (
        <TopCompaniesChart 
          data={chartData?.topCompanies} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 4. District Distribution */}
      {chartVisibility.districtDistribution && (
        <NeighborhoodsChart 
          data={chartData?.districtDistribution} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 5. Services by Department */}
      {chartVisibility.servicesByDepartment && (
        <ServiceTypesChart 
          data={chartData?.servicesByDepartment} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 6. Services by District */}
      {chartVisibility.servicesByDistrict && (
        <ServicesByDistrictChart 
          data={chartData?.servicesByDistrict} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 7. Time Comparison */}
      {chartVisibility.timeComparison && (
        <TimeComparisonChart 
          data={chartData?.timeComparison} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 8. Efficiency Impact */}
      {chartVisibility.efficiencyImpact && (
        <EfficiencyImpactChart 
          data={chartData?.efficiencyImpact} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 9. Daily Demands */}
      {chartVisibility.dailyDemands && (
        <DailyDemandsChart 
          data={chartData?.dailyDemands} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 10. Neighborhood Comparison */}
      {chartVisibility.neighborhoodComparison && (
        <NeighborhoodComparisonChart 
          data={chartData?.neighborhoodComparison} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 11. District Efficiency Radar */}
      {chartVisibility.districtEfficiencyRadar && (
        <DistrictEfficiencyRadarChart 
          data={chartData?.districtEfficiencyRadar} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 12. Status Transition */}
      {chartVisibility.statusTransition && (
        <StatusTransitionChart 
          data={chartData?.statusTransition} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 13. Critical Status */}
      {chartVisibility.criticalStatus && (
        <CriticalStatusChart 
          data={chartData?.criticalStatus} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 14. External Districts */}
      {chartVisibility.externalDistricts && (
        <ExternalDistrictsChart 
          data={chartData?.externalDistricts} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 15. Service Diversity */}
      {chartVisibility.serviceDiversity && (
        <ServiceDiversityChart 
          data={chartData?.serviceDiversity} 
          isLoading={isLoading} 
        />
      )}
      
      {/* 16. Closure Time */}
      {chartVisibility.closureTime && (
        <ClosureTimeChart 
          data={chartData?.closureTime} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default ChartsSection;
