
import React, { useState } from 'react';
import { SlidersHorizontal, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChartCard from './charts/ChartCard';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import RankingFilterDialog from './filters/RankingFilterDialog';
import { formatDate } from '@/lib/utils';
import InsightsPanel from './insights/InsightsPanel';
import DashboardCards from './insights/DashboardCards';
import RankingTabs from './tabs/RankingTabs';
import { ChartConfig } from '@/types/ranking';

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
  className = '',
  buttonText = 'Filtrar',
  lastUpdateText = 'Última atualização'
}) => {
  const { 
    charts, 
    isLoading, 
    refreshData, 
    chartVisibility,
    toggleChartVisibility,
    lastUpdated,
    currentTab,
    setCurrentTab,
    planilhaData,
    painelData,
    uploadId
  } = useRankingCharts();
  
  // State to track which charts should show analysis instead of visualization
  const [analysisVisibility, setAnalysisVisibility] = useState<Record<string, boolean>>({});
  
  // Toggle analysis visibility for a specific chart
  const toggleAnalysisVisibility = (chartId: string) => {
    setAnalysisVisibility(prevState => ({
      ...prevState,
      [chartId]: !prevState[chartId]
    }));
  };
  
  // Analyses text for charts
  const chartAnalyses = {
    evServ: "Há uma leve queda nas pendências, mas o ritmo ainda é lento. Cancelamentos são raros, o que é positivo, mas a curva de conclusões ainda não acelera. Reforça necessidade de gestão de fluxo.",
    serviceDistribution: "A poda de árvores domina as reclamações. Importante verificar se há gargalos operacionais ou sazonalidade. O gráfico reforça a percepção pública sobre a vegetação urbana.",
    executionTime: "Tapa-buraco tem maior tempo médio de resolução, indicando possível gargalo. Coleta de lixo e bueiros têm desempenho melhor. Boa oportunidade para revisão de contratos ou processos.",
    districtsWronglyIncluded: "Distritos de outras subprefeituras estão gerando demandas atribuídas erroneamente à Sub Pinheiros. Isso distorce métricas e rankings, e deve ser corrigido com filtros automáticos e reclassificação.",
    compByArea: "CTO é destaque em execução de serviços. Já Planejamento e COMDEC têm alto volume pendente. Pode indicar sobrecarga, falta de equipe ou burocracia. Hora de redistribuir ou intervir.",
    top10OldestPending: "Enel e Sabesp concentram as pendências mais críticas. Isso prejudica diretamente a performance da subprefeitura no ranking. Intervenções de alto nível podem ser necessárias com esses parceiros.",
    bottlenecks: "20% dos gargalos são externos (Enel e Sabesp). Reflete diretamente no desempenho do governo local e reforça a necessidade de articulação interinstitucional com concessionárias.",
    idealRanking: "A Subprefeitura de Pinheiros estaria em 2º lugar sem interferências externas — um dado poderoso para narrativas de eficiência. O gap entre ranking real e ideal mostra onde o esforço deve ser concentrado.",
    sgzRanking: "60% das OS são contabilizadas corretamente, mas 40% têm problemas (desconsideradas ou mal classificadas). Isso distorce rankings e penaliza injustamente a subprefeitura. Reforçar validação e reclassificação é essencial.",
    attentionPoints: "Protocolos sem resposta e cadastros errados lideram os problemas. Muitos deles são evitáveis com revisão de processos internos e capacitação das equipes. Um ajuste aqui pode ter grande impacto positivo.",
  };
  
  return (
    <div className="space-y-6">
      {/* KPI Dashboard Cards */}
      <DashboardCards dadosPlanilha={planilhaData || []} dadosPainel={painelData} uploadId={uploadId} />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <RankingTabs currentTab={currentTab} onChange={setCurrentTab} />
          
          <div className="text-xs text-gray-500 mt-1 sm:mt-0">
            {lastUpdateText}: {lastUpdated ? formatDate(lastUpdated) : 'Carregando...'}
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none"
            onClick={() => refreshData()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {buttonText}
          </Button>
          
          <Button 
            variant="default" 
            className="flex-1 sm:flex-none"
            onClick={() => setFilterDialogOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${disableCardContainers ? '' : 'kpi-container'} ${className}`}>
        {charts.map((chart: ChartConfig) => 
          chartVisibility[chart.id] && (
            <ChartCard 
              key={chart.id} 
              title={chart.title} 
              subtitle={chart.subtitle}
              value={chart.value || ''}
              isLoading={isLoading} 
              isDraggable={false}
              onToggleVisibility={() => toggleChartVisibility(chart.id)}
              onToggleAnalysis={() => toggleAnalysisVisibility(chart.id)}
              analysis={(chartAnalyses as any)[chart.id]}
              showAnalysis={analysisVisibility[chart.id]}
            >
              {chart.component}
            </ChartCard>
          )
        )}
      </div>

      {/* Insights Panel */}
      <InsightsPanel planilhaData={planilhaData || []} isLoading={isLoading} />
      
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
