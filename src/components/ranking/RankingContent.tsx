
import React, { useState, useEffect } from 'react';
import RankingFilterDialog from './filters/RankingFilterDialog';
import RankingCharts from './RankingCharts';
import { ChartVisibility } from './types';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import DashboardCards from './insights/DashboardCards';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { toast } from 'sonner';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    chartVisibility, toggleChartVisibility, setChartVisibility,
    planilhaData, sgzData, painelData, isLoading, setIsInsightsLoading,
    refreshChartData, isMockData, dataSource, setDataSource
  } = useRankingCharts();
  
  const { 
    lastRefreshTime, 
    dataSource: uploadDataSource, 
    setDataSource: setUploadDataSource 
  } = useUploadState();
  
  const { showFeedback } = useAnimatedFeedback();

  // Synchronize data sources on mount and when they change
  useEffect(() => {
    const localDataSource = localStorage.getItem('demo-data-source');
    if (localDataSource && (localDataSource === 'mock' || localDataSource === 'upload' || localDataSource === 'supabase')) {
      if (dataSource !== localDataSource) {
        console.log(`Syncing data source: localStorage: ${localDataSource}, state: ${dataSource}`);
        setDataSource(localDataSource as 'mock' | 'upload' | 'supabase');
      }
      
      if (uploadDataSource !== localDataSource) {
        setUploadDataSource(localDataSource as 'mock' | 'upload' | 'supabase');
      }
    }
  }, [dataSource, uploadDataSource, setDataSource, setUploadDataSource]);

  // Log data availability for debugging
  useEffect(() => {
    console.log("RankingContent: Data availability check:", {
      planilhaData: planilhaData?.length || 0,
      sgzData: sgzData?.length || 0,
      painelData: painelData?.length || 0,
      isMockData,
      dataSource,
      isLoading,
      localStorageDataSource: localStorage.getItem('demo-data-source') || 'unknown',
      lastUpdate: localStorage.getItem('demo-last-update') || 'never',
      uploadDataSource
    });
  }, [planilhaData, sgzData, painelData, isMockData, isLoading, dataSource, uploadDataSource]);

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
      console.log("RankingContent: Calling onRefreshData on mount");
      setIsRefreshing(true);
      
      onRefreshData().catch(err => {
        console.error("Error refreshing data on mount:", err);
        toast.error("Erro ao carregar dados iniciais");
      }).finally(() => {
        setIsRefreshing(false);
      });
    }
  }, [onRefreshData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="md:col-span-1">
          <DashboardCards 
            dadosPlanilha={planilhaData} 
            dadosPainel={painelData} 
            isSimulationActive={isSimulationActive}
          />
        </div>
      </div>

      <RankingCharts
        chartData={{}}
        sgzData={sgzData || planilhaData}
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
