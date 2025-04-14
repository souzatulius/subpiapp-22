
import React, { useState, useEffect } from 'react';
import RankingFilterDialog from './filters/RankingFilterDialog';
import RankingCharts from './RankingCharts';
import { ChartVisibility } from './types';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import DashboardCards from './insights/DashboardCards';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    planilhaData, sgzData, painelData, isLoading, 
    refreshChartData, isMockData, dataSource, setDataSource
  } = useRankingCharts();
  
  const { 
    lastRefreshTime, 
    dataSource: uploadDataSource, 
    setDataSource: setUploadDataSource 
  } = useUploadState();
  
  const { showFeedback } = useAnimatedFeedback();

  // Sync data source between localStorage and state
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

  // Show loading feedback when data is being loaded
  useEffect(() => {
    if (isLoading) {
      showFeedback('loading', 'Gerando insights e gráficos...', { 
        duration: 0, 
        progress: 50,
        stage: 'Processando dados'
      });
    }
  }, [isLoading, showFeedback]);

  // Refresh data on mount if refresh function is provided
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

  // Handle manual data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefreshData) {
        await onRefreshData();
        toast.success('Dados atualizados com sucesso');
      } else {
        await refreshChartData();
        toast.success('Dados atualizados com sucesso');
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={`space-y-6 max-w-full overflow-x-hidden ${className}`}>
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {lastRefreshTime && (
            <span className="text-xs text-gray-500">
              {lastUpdateText}: {new Date(lastRefreshTime).toLocaleString()}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {buttonText}
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="overflow-x-hidden">
        <DashboardCards 
          dadosPlanilha={planilhaData} 
          dadosPainel={painelData} 
          isSimulationActive={isSimulationActive}
        />
      </div>

      {/* Ranking Charts */}
      <div className="overflow-x-hidden">
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
      </div>

      {/* Filter Dialog */}
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
