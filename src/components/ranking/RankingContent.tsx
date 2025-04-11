
import React, { useState } from 'react';
import { useRealData } from './RealDataProvider';
import FilterDialog from './FilterDialog';
import RankingCharts from './RankingCharts';
import RankingFilters from './RankingFilters';
import { ChartVisibility } from '@/components/ranking/types';

interface RankingContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  disableCardContainers?: boolean;
  className?: string;
  buttonText?: string;
  lastUpdateText?: string;
}

const RankingContent = ({
  filterDialogOpen,
  setFilterDialogOpen,
  disableCardContainers = false,
  className = '',
  buttonText = 'Filtrar',
  lastUpdateText = 'Última atualização'
}: RankingContentProps) => {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const { 
    isLoading, 
    sgzData, 
    painelData,
    refreshData,
    lastUpdated,
    hasData
  } = useRealData();
  
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    districtPerformance: true,
    serviceTypes: true,
    resolutionTime: true,
    responsibility: true,
    evolution: true,
    departmentComparison: true,
    oldestPendingList: true,
    statusDistribution: true,
    topCompanies: true,
    districtDistribution: true,
    servicesByDepartment: true,
    servicesByDistrict: true,
    timeComparison: true,
    dailyDemands: true,
    statusTransition: true,
    closureTime: true,
    neighborhoodComparison: true,
    districtEfficiencyRadar: true,
    externalDistricts: true,
    efficiencyImpact: true,
    criticalStatus: true,
    serviceDiversity: true,
  });

  const handleSimulateIdealRanking = () => {
    setIsSimulationActive(prev => !prev);
  };

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <div className={className}>
      {/* Filters */}
      <RankingFilters
        onOpenFilterDialog={() => setFilterDialogOpen(true)}
        buttonText={buttonText}
        lastUpdateText={lastUpdateText}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
      />
      
      {/* Charts */}
      <div className="mt-6">
        <RankingCharts 
          chartData={{}}
          isLoading={isLoading}
          chartVisibility={chartVisibility as ChartVisibility}
          sgzData={sgzData}
          painelData={painelData}
          onSimulateIdealRanking={handleSimulateIdealRanking}
          isSimulationActive={isSimulationActive}
          disableCardContainers={disableCardContainers}
        />
      </div>
      
      {/* Filter Dialog */}
      <FilterDialog 
        isOpen={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        chartVisibility={chartVisibility as ChartVisibility}
        setChartVisibility={setChartVisibility as React.Dispatch<React.SetStateAction<ChartVisibility>>}
      />
    </div>
  );
};

export default RankingContent;
