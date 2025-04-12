
import React, { useState, useEffect } from 'react';
import RankingFilterDialog from './filters/RankingFilterDialog';
import RankingCharts from './RankingCharts';
import { ChartVisibility } from './types';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import DashboardCards from './insights/DashboardCards';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import UploadProgressDisplay from './UploadProgressDisplay';
import { useUploadState } from '@/hooks/ranking/useUploadState';

interface RankingContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  disableCardContainers?: boolean;
  className?: string;
  buttonText?: string;
  lastUpdateText?: string;
  onRefreshData?: () => Promise<void>;
}

const RankingContent: React.FC<RankingContentProps> = ({
  filterDialogOpen,
  setFilterDialogOpen,
  disableCardContainers = false,
  className = "",
  buttonText = "Filtrar",
  lastUpdateText = "Última Atualização",
  onRefreshData
}) => {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const { 
    chartVisibility, toggleChartVisibility, setChartVisibility,
    planilhaData, sgzData, painelData, isLoading, setIsInsightsLoading,
    refreshChartData
  } = useRankingCharts();
  
  const { sgzProgress, painelProgress, lastRefreshTime } = useUploadState();
  const { showFeedback } = useAnimatedFeedback();

  const handleSimulateIdealRanking = () => {
    const wasActive = isSimulationActive;
    setIsSimulationActive(!isSimulationActive);
    
    if (!wasActive) {
      showFeedback('success', 'Simulação de ranking ideal ativada', { duration: 2000 });
    } else {
      showFeedback('warning', 'Simulação de ranking ideal desativada', { duration: 2000 });
    }
  };

  // Show loading feedback when insights are being generated
  useEffect(() => {
    if (isLoading) {
      showFeedback('loading', 'Gerando insights e gráficos...', { 
        duration: 0, 
        progress: 50,
        stage: 'Processando dados'
      });
    }
  }, [isLoading, showFeedback]);

  // Refresh data when component mounts
  useEffect(() => {
    if (onRefreshData) {
      onRefreshData();
    }
  }, [onRefreshData]);

  return (
    <div className="space-y-6">
      <DashboardCards 
        dadosPlanilha={planilhaData} 
        dadosPainel={painelData} 
        isSimulationActive={isSimulationActive}
      />

      {/* Display upload progress when uploads are in progress */}
      {(sgzProgress || painelProgress) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {sgzProgress && (
            <UploadProgressDisplay 
              stats={sgzProgress} 
              type="sgz"
            />
          )}
          {painelProgress && (
            <UploadProgressDisplay 
              stats={painelProgress}
              type="painel"
            />
          )}
        </div>
      )}

      <RankingCharts
        chartData={{}}
        sgzData={planilhaData}
        painelData={painelData}
        isLoading={isLoading}
        chartVisibility={chartVisibility}
        isSimulationActive={isSimulationActive}
        onSimulateIdealRanking={handleSimulateIdealRanking}
        disableCardContainers={disableCardContainers}
        onToggleChartVisibility={toggleChartVisibility}
      />

      <RankingFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen}
        chartVisibility={chartVisibility}
        onToggleChartVisibility={toggleChartVisibility}
      />
    </div>
  );
};

export default RankingContent;
