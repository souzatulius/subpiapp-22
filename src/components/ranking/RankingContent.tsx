
import React, { useState, useEffect } from 'react';
import RankingFilterDialog from './filters/RankingFilterDialog';
import RankingCharts from './RankingCharts';
import { ChartVisibility } from './types';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import DashboardCards from './insights/DashboardCards';

interface RankingContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  disableCardContainers?: boolean;
  className?: string;
  buttonText?: string;
  lastUpdateText?: string;
}

const RankingContent: React.FC<RankingContentProps> = ({
  filterDialogOpen,
  setFilterDialogOpen,
  disableCardContainers = false,
  className = "",
  buttonText = "Filtrar",
  lastUpdateText = "Última Atualização"
}) => {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const { 
    chartVisibility, toggleChartVisibility, setChartVisibility,
    planilhaData, sgzData, painelData, isLoading
  } = useRankingCharts();

  const handleSimulateIdealRanking = () => {
    setIsSimulationActive(!isSimulationActive);
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
        sgzData={planilhaData}
        painelData={painelData}
        isLoading={isLoading}
        chartVisibility={chartVisibility}
        isSimulationActive={isSimulationActive}
        onSimulateIdealRanking={handleSimulateIdealRanking}
        disableCardContainers={disableCardContainers}
        onToggleChartVisibility={toggleChartVisibility}
      />

      {/* Hidden charts container for charts that were removed but can be restored */}
      <HiddenChartsContainer 
        chartVisibility={chartVisibility} 
        setChartVisibility={setChartVisibility}
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

// Component to show hidden charts that can be restored
const HiddenChartsContainer: React.FC<{
  chartVisibility: ChartVisibility;
  setChartVisibility: (vis: ChartVisibility) => void;
}> = ({ chartVisibility, setChartVisibility }) => {
  const hiddenCharts = Object.entries(chartVisibility).filter(([_, visible]) => !visible);
  
  if (hiddenCharts.length === 0) {
    return null;
  }
  
  const handleRestoreAll = () => {
    const updatedVisibility = { ...chartVisibility };
    Object.keys(updatedVisibility).forEach(key => {
      updatedVisibility[key] = true;
    });
    setChartVisibility(updatedVisibility);
  };
  
  const handleRestore = (chartId: string) => {
    setChartVisibility({
      ...chartVisibility,
      [chartId]: true
    });
  };
  
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Gráficos Ocultos</h3>
        <button 
          className="text-xs text-blue-600 hover:text-blue-800"
          onClick={handleRestoreAll}
        >
          Restaurar todos
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {hiddenCharts.map(([chartId]) => (
          <button
            key={chartId}
            className="px-3 py-1 bg-white text-sm rounded-full border border-gray-300 hover:bg-gray-100"
            onClick={() => handleRestore(chartId)}
          >
            {getChartName(chartId)}
          </button>
        ))}
      </div>
    </div>
  );
};

// Helper function to get a human-readable name for chart IDs
const getChartName = (chartId: string): string => {
  const names: Record<string, string> = {
    districtPerformance: "Ordens por Distrito (SGZ)",
    serviceTypes: "Tipos de Serviço Mais Frequentes",
    resolutionTime: "Tempo Médio por Status",
    responsibility: "Impacto dos Terceiros",
    statusDistribution: "Distribuição por Status",
    statusTransition: "Status de Atendimento",
    districtEfficiencyRadar: "Radar de Eficiência por Distrito",
    sgzPainel: "Comparativo SGZ vs Painel",
    oldestPendingList: "Tempo de Abertura das OS"
  };
  
  return names[chartId] || chartId;
};

export default RankingContent;
