
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, Briefcase, TrendingUp, PieChart, RefreshCw, Building2, 
  Clock, ListFilter, FileCheck, ActivitySquare, MapPin, Network,
  AlertTriangle
} from 'lucide-react';
import { ChartVisibility } from './types';

// Import the new chart components
import StatusAtendimentoChart from './charts/StatusAtendimentoChart';
import EficienciaDistritoChart from './charts/EficienciaDistritoChart';
import TempoMedioStatusChart from './charts/TempoMedioStatusChart';
import ComparativoPainelChart from './charts/ComparativoPainelChart';
import OrdensDistritoChart from './charts/OrdensDistritoChart';
import TiposServicoChart from './charts/TiposServicoChart';
import ImpactoTerceirosChart from './charts/ImpactoTerceirosChart';
import SituacaoPrazoChart from './charts/SituacaoPrazoChart';
import TempoAberturaChart from './charts/TempoAberturaChart';

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
  const [activeTab, setActiveTab] = useState("eficiencia");
  const [showOnlySubprefeitura, setShowOnlySubprefeitura] = useState(false);

  // Filter data if showOnlySubprefeitura is true
  const filteredSgzData = React.useMemo(() => {
    if (!sgzData) return null;
    if (showOnlySubprefeitura) {
      return sgzData.filter(item => {
        const responsavel = (item.servico_responsavel || '').toLowerCase();
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

  return (
    <Card className="p-4 bg-white border-orange-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-orange-800 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
          Análise de Desempenho
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant={showOnlySubprefeitura ? "default" : "outline"}
            className={`flex items-center gap-2 rounded-lg ${
              showOnlySubprefeitura 
                ? 'bg-blue-900 hover:bg-blue-800 text-white' 
                : 'border-blue-900 text-blue-900 hover:bg-blue-50'
            }`}
            onClick={() => setShowOnlySubprefeitura(!showOnlySubprefeitura)}
            title="Considerar apenas dados da subprefeitura"
          >
            <Building2 className="h-4 w-4" />
            Apenas Sub
          </Button>
          
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 border rounded-lg ${isSimulationActive ? 'bg-orange-100 text-orange-700 border-orange-300' : 'text-gray-600'}`}
            onClick={onSimulateIdealRanking}
            title="Como seria o ranking com dados corretos"
          >
            <RefreshCw className="h-4 w-4" />
            {isSimulationActive ? 'Desativar Simulação' : 'Simular Ranking Ideal'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="eficiencia" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6 bg-orange-50 p-1 border border-orange-100 rounded-lg">
          <TabsTrigger 
            value="eficiencia" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg"
          >
            <ActivitySquare className="h-4 w-4 mr-2" /> 
            Eficiência
          </TabsTrigger>
          <TabsTrigger 
            value="localizacao" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg"
          >
            <MapPin className="h-4 w-4 mr-2" /> 
            Localização
          </TabsTrigger>
          <TabsTrigger 
            value="servicos"
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Serviços
          </TabsTrigger>
          <TabsTrigger 
            value="problemas" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg"
          >
            <AlertTriangle className="h-4 w-4 mr-2" /> 
            Problemas
          </TabsTrigger>
        </TabsList>

        {/* Eficiência Tab */}
        <TabsContent value="eficiencia" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <StatusAtendimentoChart
              data={filteredSgzData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
            
            <EficienciaDistritoChart
              data={filteredSgzData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
            
            <TempoMedioStatusChart
              data={filteredSgzData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
            
            <ComparativoPainelChart
              sgzData={sgzData}
              painelData={painelData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
          </div>
        </TabsContent>

        {/* Localização Tab */}
        <TabsContent value="localizacao" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrdensDistritoChart
              data={filteredSgzData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
            
            {/* We can add more location-based charts here in the future */}
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <MapPin className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500">Mais gráficos em breve</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Estamos preparando mais análises territoriais para ajudar na distribuição de recursos.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Serviços Tab */}
        <TabsContent value="servicos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TiposServicoChart
              data={filteredSgzData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
            
            <ImpactoTerceirosChart
              data={filteredSgzData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
          </div>
        </TabsContent>

        {/* Problemas Tab */}
        <TabsContent value="problemas" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SituacaoPrazoChart
              data={filteredPainelData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
            
            <TempoAberturaChart
              data={filteredSgzData}
              isLoading={isLoading}
              isSimulationActive={isSimulationActive}
            />
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
