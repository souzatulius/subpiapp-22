
import React, { useState, useEffect } from 'react';
import RankingFilterDialog from './filters/RankingFilterDialog';
import RankingCharts from './RankingCharts';
import { ChartVisibility } from './types';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import DashboardCards from './insights/DashboardCards';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import ChartDebugPanel from './charts/ChartDebugPanel';
import UploadHistoryCard from './UploadHistoryCard';
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
  const [isDebugVisible, setIsDebugVisible] = useState(process.env.NODE_ENV === 'development');
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
      
      // Set isMockData based on the data source
      if (localDataSource === 'mock' && !isMockData) {
        console.log('Setting isMockData to true because localDataSource is mock');
      } else if (localDataSource !== 'mock' && isMockData) {
        console.log('Setting isMockData to false because localDataSource is not mock');
      }
    }
    
    // Load data from localStorage if needed
    if ((!sgzData || sgzData.length === 0) && (!planilhaData || planilhaData.length === 0)) {
      try {
        const sgzDataFromLocalStorage = localStorage.getItem('demo-sgz-data');
        if (sgzDataFromLocalStorage) {
          const data = JSON.parse(sgzDataFromLocalStorage);
          if (Array.isArray(data) && data.length > 0) {
            console.log(`Loading ${data.length} SGZ items from localStorage`);
          }
        }
      } catch (e) {
        console.error('Error loading SGZ data from localStorage:', e);
      }
    }
  }, [dataSource, uploadDataSource, isMockData, sgzData, planilhaData, setDataSource, setUploadDataSource]);

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

  // Toggle debug panel with Alt+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.altKey) {
        setIsDebugVisible(prevState => !prevState);
        if (!isDebugVisible) {
          toast.info("Painel de debug ativado", { duration: 1000 });
        } else {
          toast.info("Painel de debug desativado", { duration: 1000 });
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDebugVisible]);
  
  // Function to handle mock data updates - will be passed to the debug panel
  const handleUpdateMockData = async (type: 'sgz' | 'painel', data: any[]): Promise<boolean> => {
    console.log(`RankingContent: Attempting to update ${type} mock data`);
    
    try {
      // Store in localStorage for persistence and set data source to mock
      if (type === 'sgz') {
        localStorage.setItem('demo-sgz-data', JSON.stringify(data));
        localStorage.setItem('demo-last-update', new Date().toISOString());
      } else if (type === 'painel') {
        localStorage.setItem('demo-painel-data', JSON.stringify(data));
        localStorage.setItem('demo-last-update', new Date().toISOString());
      }
      
      // Always set to mock when manually updating mock data
      localStorage.setItem('demo-data-source', 'mock');
      setDataSource('mock');
      setUploadDataSource('mock');
      
      // Refresh charts after updating mock data
      if (onRefreshData) {
        await onRefreshData();
      } else {
        await refreshChartData();
      }
      
      toast.success(`Dados ${type} atualizados com sucesso`);
      return true;
    } catch (error) {
      console.error(`Error updating ${type} mock data:`, error);
      toast.error(`Erro ao atualizar dados mock de ${type}`);
      return false;
    }
  };

  // Safely format the lastRefreshTime for display
  const formatLastRefreshTime = () => {
    if (!lastRefreshTime) return null;
    
    try {
      // Handle both string and Date objects
      const date = typeof lastRefreshTime === 'string' 
        ? new Date(lastRefreshTime) 
        : lastRefreshTime instanceof Date 
          ? lastRefreshTime 
          : null;
          
      if (!date) return null;
      
      return date.toISOString();
    } catch (e) {
      console.error("Error formatting lastRefreshTime:", e);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <DashboardCards 
            dadosPlanilha={planilhaData} 
            dadosPainel={painelData} 
            isSimulationActive={isSimulationActive}
          />
        </div>
        <div className="md:col-span-1">
          <UploadHistoryCard 
            sgzData={sgzData || planilhaData}
            painelData={painelData}
            lastUpdate={localStorage.getItem('demo-last-update')}
            isRefreshing={isRefreshing}
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
      
      {/* Only render the debug panel if we're in development mode or debug is visible */}
      {isDebugVisible && (
        <ChartDebugPanel 
          sgzData={sgzData || planilhaData} 
          painelData={painelData}
          isVisible={isDebugVisible}
          onUpdateMockData={handleUpdateMockData}
          dataSource={dataSource}
          dataStatus={{
            sgzCount: sgzData?.length || 0,
            painelCount: painelData?.length || 0,
            lastSgzUpdate: formatLastRefreshTime(),
            lastPainelUpdate: formatLastRefreshTime(),
            dataSource: dataSource
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default RankingContent;
