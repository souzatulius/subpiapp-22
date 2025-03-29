
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, Briefcase, TrendingUp, PieChart, RefreshCw } from 'lucide-react';
import { ChartVisibility } from './types';
import ResponsibilityChart from './charts/ResponsibilityChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import DistrictPerformanceChart from './charts/DistrictPerformanceChart';
import ResolutionTimeChart from './charts/ResolutionTimeChart';
import EvolutionChart from './charts/EvolutionChart';
import DepartmentComparisonChart from './charts/DepartmentComparisonChart';
import OldestPendingList from './charts/OldestPendingList';

interface RankingChartsProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
  isSimulationActive: boolean;
  onSimulateIdealRanking: () => void;
}

const RankingCharts: React.FC<RankingChartsProps> = ({
  sgzData,
  painelData,
  isLoading,
  chartVisibility,
  isSimulationActive,
  onSimulateIdealRanking
}) => {
  const [activeTab, setActiveTab] = useState("performance");

  // Sample empty data object for charts
  const emptyData = {};

  return (
    <Card className="p-4 bg-white border-orange-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-orange-700 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
          Análise de Desempenho
        </h2>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 border ${isSimulationActive ? 'bg-orange-100 text-orange-700 border-orange-300' : 'text-gray-600'}`}
          onClick={onSimulateIdealRanking}
        >
          <RefreshCw className="h-4 w-4" />
          {isSimulationActive ? 'Desativar Simulação' : 'Simular Ranking Ideal'}
        </Button>
      </div>

      <Tabs defaultValue="performance" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6 bg-orange-50 p-1 border border-orange-100">
          <TabsTrigger 
            value="performance" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4 mr-2" /> 
            Performance
          </TabsTrigger>
          <TabsTrigger 
            value="distribution" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <PieChart className="h-4 w-4 mr-2" /> 
            Distribuição
          </TabsTrigger>
          <TabsTrigger 
            value="departments" 
            className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Briefcase className="h-4 w-4 mr-2" /> 
            Departamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {chartVisibility.districtPerformance && (
              <DistrictPerformanceChart 
                data={emptyData} 
                sgzData={sgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
              />
            )}
            {chartVisibility.evolution && (
              <EvolutionChart 
                data={emptyData} 
                sgzData={sgzData} 
                painelData={painelData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartVisibility.resolutionTime && (
              <ResolutionTimeChart 
                data={emptyData} 
                sgzData={sgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
              />
            )}
            {chartVisibility.oldestPendingList && (
              <OldestPendingList 
                data={emptyData} 
                sgzData={sgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartVisibility.serviceTypes && (
              <ServiceTypesChart 
                data={emptyData} 
                sgzData={sgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
              />
            )}
            {chartVisibility.responsibility && (
              <ResponsibilityChart 
                data={emptyData} 
                sgzData={sgzData} 
                painelData={painelData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartVisibility.departmentComparison && (
              <DepartmentComparisonChart 
                data={emptyData} 
                sgzData={sgzData} 
                isLoading={isLoading} 
                isSimulationActive={isSimulationActive} 
              />
            )}
            {/* We can add more department-specific charts here */}
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
    </Card>
  );
};

export default RankingCharts;
