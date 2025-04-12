
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
  const { 
    chartVisibility, toggleChartVisibility, setChartVisibility,
    planilhaData, sgzData, painelData, isLoading, setIsInsightsLoading,
    refreshChartData, isMockData
  } = useRankingCharts();
  
  const { lastRefreshTime } = useUploadState();
  const { showFeedback } = useAnimatedFeedback();

  // Log data availability for debugging
  useEffect(() => {
    console.log("RankingContent: Data availability check:", {
      planilhaData: planilhaData?.length || 0,
      sgzData: sgzData?.length || 0,
      painelData: painelData?.length || 0,
      isMockData,
      isLoading,
      dataSource: localStorage.getItem('demo-data-source') || 'unknown',
      lastUpdate: localStorage.getItem('demo-last-update') || 'never'
    });
  }, [planilhaData, sgzData, painelData, isMockData, isLoading]);

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
      onRefreshData().catch(err => {
        console.error("Error refreshing data on mount:", err);
        toast.error("Erro ao carregar dados iniciais");
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
      // We no longer have the DemoDataProvider, so we'll use refreshChartData directly
      if (type === 'sgz') {
        // Store in localStorage for persistence
        localStorage.setItem('demo-sgz-data', JSON.stringify(data));
        localStorage.setItem('demo-last-update', new Date().toISOString());
        localStorage.setItem('demo-data-source', 'mock');
      } else if (type === 'painel') {
        localStorage.setItem('demo-painel-data', JSON.stringify(data));
        localStorage.setItem('demo-last-update', new Date().toISOString());
        localStorage.setItem('demo-data-source', 'mock');
      }
      
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
          />
        </div>
      </div>

      <RankingCharts
        chartData={{}}
        sgzData={sgzData || planilhaData} // Use sgzData if available, fall back to planilhaData
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
          dataSource={isMockData ? 'mock' : 'supabase'}
          dataStatus={{
            sgzCount: sgzData?.length || 0,
            painelCount: painelData?.length || 0,
            lastSgzUpdate: lastRefreshTime ? lastRefreshTime.toISOString() : null,
            lastPainelUpdate: lastRefreshTime ? lastRefreshTime.toISOString() : null,
            dataSource: localStorage.getItem('demo-data-source') || 'unknown'
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default RankingContent;
