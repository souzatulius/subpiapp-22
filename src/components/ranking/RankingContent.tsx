
import React, { useState } from 'react';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import FilterDialog from './FilterDialog';
import RankingCharts from './RankingCharts';
import RankingFilters from './RankingFilters';
import DemoChartsSection from './DemoChartsSection';
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
    chartVisibility,
    setChartVisibility
  } = useRankingCharts();

  const handleSimulateIdealRanking = () => {
    setIsSimulationActive(prev => !prev);
  };

  return (
    <div className={className}>
      {/* Filters */}
      <RankingFilters
        onOpenFilterDialog={() => setFilterDialogOpen(true)}
        buttonText={buttonText}
        lastUpdateText={lastUpdateText}
      />
      
      {/* Demo Charts Section */}
      <DemoChartsSection className="mt-6" />
      
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
