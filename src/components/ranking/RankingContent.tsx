
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
import InsightsSection from './insights/InsightsSection';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const { 
    chartVisibility, 
    toggleChartVisibility, 
    setChartVisibility,
    planilhaData, 
    sgzData, 
    painelData, 
    isLoading, 
    refreshChartData, 
    isMockData, 
    dataSource, 
    setDataSource
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

  // On initial mount, attempt to load data from localStorage to persist between page visits
  useEffect(() => {
    const loadCachedData = () => {
      try {
        // Check if we have cached SGZ data
        const cachedSgzData = localStorage.getItem('demo-sgz-data');
        const cachedPainelData = localStorage.getItem('demo-painel-data');

        if (cachedSgzData) {
          const parsedData = JSON.parse(cachedSgzData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log('Loading cached SGZ data from localStorage:', parsedData.length, 'records');
            return true; // Found cached data
          }
        }

        if (cachedPainelData) {
          const parsedData = JSON.parse(cachedPainelData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log('Loading cached Painel data from localStorage:', parsedData.length, 'records');
            return true; // Found cached data
          }
        }

        return false; // No cached data found
      } catch (error) {
        console.error('Error loading cached data:', error);
        return false;
      }
    };

    // Only show the loading feedback if this is the first load and we don't have cached data
    const hasCachedData = loadCachedData();
    
    if (isInitialLoad && !hasCachedData) {
      showFeedback('loading', 'Carregando dados do ranking...', { 
        duration: 0,
        progress: 30,
        stage: 'Inicializando'
      });
    }

    // Set initial load to false after first render
    setIsInitialLoad(false);
  }, [showFeedback, isInitialLoad]);

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

  // Only show loading feedback when data is being loaded on first render
  useEffect(() => {
    if (isLoading && isInitialLoad) {
      showFeedback('loading', 'Gerando insights e gráficos...', { 
        duration: 0, 
        progress: 50,
        stage: 'Processando dados'
      });
    } else if (!isLoading && isInitialLoad) {
      // Clear loading feedback when data is loaded
      showFeedback('success', 'Dados carregados com sucesso', { duration: 1500 });
    }
  }, [isLoading, showFeedback, isInitialLoad]);

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
      </div>

      {isMobile && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button variant="outline" size="sm" className="text-xs">Eficiência</Button>
          <Button variant="outline" size="sm" className="text-xs">Localização</Button>
          <Button variant="outline" size="sm" className="text-xs">Serviços</Button>
          <Button variant="outline" size="sm" className="text-xs">Problemas +</Button>
          <Button variant="outline" size="sm" className="text-xs">Apenas Sub</Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={handleSimulateIdealRanking}
          >
            {isSimulationActive ? "Desativar Simulação" : "Simular Ranking Ideal"}
          </Button>
        </div>
      )}

      {/* Insights Section - New component */}
      <InsightsSection 
        sgzData={sgzData || planilhaData} 
        painelData={painelData} 
        isSimulationActive={isSimulationActive} 
        isMobile={isMobile}
      />

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
          disableCardContainers={disableCardContainers || isMobile}
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
