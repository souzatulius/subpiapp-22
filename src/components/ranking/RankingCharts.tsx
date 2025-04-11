
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, Briefcase, TrendingUp, PieChart, RefreshCw, Building2, Clock, ListFilter, FileCheck } from 'lucide-react';
import { ChartVisibility } from './types';
import ResponsibilityChart from './charts/ResponsibilityChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import DistrictPerformanceChart from './charts/DistrictPerformanceChart';
import ResolutionTimeChart from './charts/ResolutionTimeChart';
import OldestPendingList from './charts/OldestPendingList';
import StatusDistributionChart from './charts/StatusDistributionChart';
import StatusTransitionChart from './charts/StatusTransitionChart';
import DistrictEfficiencyRadarChart from './charts/DistrictEfficiencyRadarChart';
import ComparativoSGZPainelChart from './charts/ComparativoSGZPainelChart';

interface RankingChartsProps {
  chartData: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
  isSimulationActive: boolean;
  onSimulateIdealRanking: () => void;
  disableCardContainers?: boolean;
  onToggleChartVisibility?: (chartId: string) => void;
}

const RankingCharts: React.FC<RankingChartsProps> = ({
  chartData,
  sgzData,
  painelData,
  isLoading,
  chartVisibility,
  isSimulationActive,
  onSimulateIdealRanking,
  disableCardContainers = false,
  onToggleChartVisibility
}) => {
  const [activeTab, setActiveTab] = useState("status");
  const [showOnlySubprefeitura, setShowOnlySubprefeitura] = useState(false);
  const [showingAnalysis, setShowingAnalysis] = useState<Record<string, boolean>>({});

  // Filter data if showOnlySubprefeitura is true
  const filteredSgzData = React.useMemo(() => {
    if (!sgzData) return null;
    if (showOnlySubprefeitura) {
      return sgzData.filter(item => {
        const responsavel = (item.sgz_responsavel || '').toLowerCase();
        return responsavel.includes('subpref');
      });
    }
    return sgzData;
  }, [sgzData, showOnlySubprefeitura]);

  // Filter painelData if showOnlySubprefeitura is true
  const filteredPainelData = React.useMemo(() => {
    if (!painelData) return null;
    if (showOnlySubprefeitura) {
      return painelData.filter(item => {
        const responsavel = (item.responsavel_classificado || '').toLowerCase();
        return responsavel.includes('subpref');
      });
    }
    return painelData;
  }, [painelData, showOnlySubprefeitura]);

  // Toggle analysis view for a specific chart
  const toggleAnalysis = (chartId: string) => {
    setShowingAnalysis(prev => ({
      ...prev,
      [chartId]: !prev[chartId]
    }));
  };

  // Sample empty data object for charts
  const emptyData = {};

  return (
    <Card className="p-4 bg-white border-orange-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-orange-700 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
          Análise de Desempenho
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant={showOnlySubprefeitura ? "default" : "outline"}
            className={`flex items-center gap-2 ${showOnlySubprefeitura ? 'bg-green-600 hover:bg-green-700' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
            onClick={() => setShowOnlySubprefeitura(!showOnlySubprefeitura)}
          >
            <Building2 className="h-4 w-4" />
            {showOnlySubprefeitura ? 'Mostrando Apenas Subprefeitura' : 'Mostrar Apenas Subprefeitura'}
          </Button>
          
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 border ${isSimulationActive ? 'bg-orange-100 text-orange-700 border-orange-300' : 'text-gray-600'}`}
            onClick={onSimulateIdealRanking}
          >
            <RefreshCw className="h-4 w-4" />
            {isSimulationActive ? 'Desativar Simulação' : 'Simular Ranking Ideal'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="status" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6 bg-orange-50 p-1 border border-orange-100">
          <TabsTrigger 
            value="status" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <ListFilter className="h-4 w-4 mr-2" /> 
            Status
          </TabsTrigger>
          <TabsTrigger 
            value="districts" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4 mr-2" /> 
            Distritos
          </TabsTrigger>
          <TabsTrigger 
            value="services" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <PieChart className="h-4 w-4 mr-2" /> 
            Serviços
          </TabsTrigger>
          <TabsTrigger 
            value="times" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4 mr-2" /> 
            Tempos
          </TabsTrigger>
          <TabsTrigger 
            value="external" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Briefcase className="h-4 w-4 mr-2" /> 
            Externos
          </TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <FileCheck className="h-4 w-4 mr-2" /> 
            Comparativo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {chartVisibility.statusDistribution && (
              <StatusDistributionChart 
                data={emptyData} 
                sgzData={filteredSgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
                onToggleVisibility={() => onToggleChartVisibility?.('statusDistribution')}
                onToggleAnalysis={() => toggleAnalysis('statusDistribution')}
              />
            )}
            {chartVisibility.statusTransition && (
              <StatusTransitionChart 
                data={emptyData} 
                sgzData={filteredSgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive}
                onToggleVisibility={() => onToggleChartVisibility?.('statusTransition')}
                onToggleAnalysis={() => toggleAnalysis('statusTransition')}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="districts" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartVisibility.districtPerformance && (
              <DistrictPerformanceChart 
                data={emptyData} 
                sgzData={filteredSgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
                onToggleVisibility={() => onToggleChartVisibility?.('districtPerformance')}
                onToggleAnalysis={() => toggleAnalysis('districtPerformance')}
              />
            )}
            {chartVisibility.districtEfficiencyRadar && (
              <DistrictEfficiencyRadarChart 
                data={emptyData} 
                sgzData={filteredSgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
                onToggleVisibility={() => onToggleChartVisibility?.('districtEfficiencyRadar')}
                onToggleAnalysis={() => toggleAnalysis('districtEfficiencyRadar')}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartVisibility.serviceTypes && (
              <ServiceTypesChart 
                data={emptyData} 
                sgzData={filteredSgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive}
                onToggleVisibility={() => onToggleChartVisibility?.('serviceTypes')}
                onToggleAnalysis={() => toggleAnalysis('serviceTypes')}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="times" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartVisibility.resolutionTime && (
              <ResolutionTimeChart 
                data={emptyData} 
                sgzData={filteredSgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
                onToggleVisibility={() => onToggleChartVisibility?.('resolutionTime')}
                onToggleAnalysis={() => toggleAnalysis('resolutionTime')}
              />
            )}
            {chartVisibility.oldestPendingList && (
              <OldestPendingList 
                data={emptyData} 
                sgzData={filteredSgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
                onToggleVisibility={() => onToggleChartVisibility?.('oldestPendingList')}
                onToggleAnalysis={() => toggleAnalysis('oldestPendingList')}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="external" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartVisibility.responsibility && (
              <ResponsibilityChart 
                data={emptyData} 
                sgzData={filteredSgzData} 
                painelData={filteredPainelData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive}
                onToggleVisibility={() => onToggleChartVisibility?.('responsibility')}
                onToggleAnalysis={() => toggleAnalysis('responsibility')}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartVisibility.sgzPainel && (
              <ComparativoSGZPainelChart 
                data={emptyData} 
                sgzData={sgzData} 
                painelData={painelData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive}
                onToggleVisibility={() => onToggleChartVisibility?.('sgzPainel')}
                onToggleAnalysis={() => toggleAnalysis('sgzPainel')}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {isSimulationActive && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 text-orange-500" />
            <span>
              <strong>Modo Simulação Ativo:</strong> Os dados exibidos representam projeções de um cenário ideal 
              após implementação das recomendações de melhoria.
            </span>
          </p>
        </div>
      )}
      
      {showOnlySubprefeitura && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-green-500" />
            <span>
              <strong>Filtro Ativo:</strong> Mostrando apenas ordens de serviço de responsabilidade direta da Subprefeitura.
              {filteredSgzData && (
                <span className="ml-1">
                  ({filteredSgzData.length} ordens de {sgzData?.length || 0} total)
                </span>
              )}
            </span>
          </p>
        </div>
      )}
    </Card>
  );
};

export default RankingCharts;
