
import React, { useState, useEffect } from 'react';
import RankingFilterDialog from './filters/RankingFilterDialog';
import RankingCharts from './RankingCharts';
import { ChartVisibility } from './types';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import DashboardCards from './insights/DashboardCards';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import ChartDebugPanel from './charts/ChartDebugPanel';
import { useDemoData } from './DemoDataProvider';
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
  
  // Get the demo data context when available (only inside DemoDataProvider)
  let demoDataContext = null;
  try {
    demoDataContext = useDemoData();
  } catch (error) {
    console.log("RankingContent: DemoDataProvider context not available");
  }

  // Log data availability for debugging
  useEffect(() => {
    console.log("RankingContent: Data availability check:", {
      planilhaData: planilhaData?.length || 0,
      sgzData: sgzData?.length || 0,
      painelData: painelData?.length || 0,
      isMockData,
      isLoading,
      demoDataAvailable: !!demoDataContext,
      demoUpdateMockDataAvailable: !!(demoDataContext?.updateMockData)
    });
  }, [planilhaData, sgzData, painelData, isMockData, isLoading, demoDataContext]);

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
  const handleUpdateMockData = async (type: 'sgz' | 'painel', data: any[]) => {
    console.log(`RankingContent: Attempting to update ${type} mock data`);
    
    if (!demoDataContext || !demoDataContext.updateMockData) {
      console.error("updateMockData function is not available in the context");
      toast.error("Função de atualização de dados mock não disponível. Verifique se o componente está dentro de DemoDataProvider.");
      return false;
    }
    
    try {
      await demoDataContext.updateMockData(type, data);
      
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
      <DashboardCards 
        dadosPlanilha={planilhaData} 
        dadosPainel={painelData} 
        isSimulationActive={isSimulationActive}
      />

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
          dataSource={demoDataContext?.dataSource || 'unknown'}
          dataStatus={demoDataContext?.dataStatus || {}}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default RankingContent;
