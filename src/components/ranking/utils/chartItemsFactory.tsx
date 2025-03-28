
import React from 'react';
import { ChartVisibility } from '../types';
import { ChartItem } from '../hooks/useChartItemsState';
import StatusDistributionChart from '../charts/StatusDistributionChart';
import ResolutionTimeChart from '../charts/ResolutionTimeChart';
import TopCompaniesChart from '../charts/TopCompaniesChart';
import NeighborhoodsChart from '../charts/NeighborhoodsChart';
import ServiceTypesChart from '../charts/ServiceTypesChart';
import ServicesByDistrictChart from '../charts/ServicesByDistrictChart';
import TimeComparisonChart from '../charts/TimeComparisonChart';
import EfficiencyImpactChart from '../charts/EfficiencyImpactChart';
import DailyDemandsChart from '../charts/DailyDemandsChart';
import NeighborhoodComparisonChart from '../charts/NeighborhoodComparisonChart';
import DistrictEfficiencyRadarChart from '../charts/DistrictEfficiencyRadarChart';
import StatusTransitionChart from '../charts/StatusTransitionChart';
import CriticalStatusChart from '../charts/CriticalStatusChart';
import ExternalDistrictsChart from '../charts/ExternalDistrictsChart';
import ServiceDiversityChart from '../charts/ServiceDiversityChart';
import ClosureTimeChart from '../charts/ClosureTimeChart';

interface ChartItemsFactoryProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
  hiddenCharts: string[];
  expandedAnalyses: string[];
  analysisOnlyCharts: string[];
}

// Helper function to prepare chart data
const prepareChartData = (rawData: any) => {
  // Return empty default data if raw data is missing
  if (!rawData) {
    return { 
      labels: [], 
      datasets: [{ 
        label: 'No Data', 
        data: [],
        backgroundColor: '#ccc' 
      }] 
    };
  }
  return rawData;
};

export const createChartItems = ({
  chartData,
  isLoading,
  chartVisibility,
  hiddenCharts,
  expandedAnalyses,
  analysisOnlyCharts
}: ChartItemsFactoryProps): ChartItem[] => {
  const items: ChartItem[] = [];
    
  if (chartVisibility.statusDistribution) {
    items.push({
      id: 'statusDistribution',
      component: <StatusDistributionChart 
        data={prepareChartData(chartData?.statusDistribution)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('statusDistribution'),
      isAnalysisExpanded: expandedAnalyses.includes('statusDistribution'),
      showAnalysisOnly: analysisOnlyCharts.includes('statusDistribution'),
      title: "Distribuição por Status",
      analysis: "Este gráfico mostra a proporção atual de ordens em cada status, permitindo identificar gargalos operacionais e tendências de conclusão."
    });
  }
  
  if (chartVisibility.resolutionTime) {
    items.push({
      id: 'resolutionTime',
      component: <ResolutionTimeChart 
        data={prepareChartData(chartData?.resolutionTime)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('resolutionTime'),
      isAnalysisExpanded: expandedAnalyses.includes('resolutionTime'),
      showAnalysisOnly: analysisOnlyCharts.includes('resolutionTime'),
      title: "Tempo de Resolução",
      analysis: "Análise do tempo médio que leva para resolver ordens de serviço por tipo, permitindo identificar quais serviços são mais eficientes."
    });
  }
  
  if (chartVisibility.topCompanies) {
    items.push({
      id: 'topCompanies',
      component: <TopCompaniesChart 
        data={prepareChartData(chartData?.topCompanies)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('topCompanies'),
      isAnalysisExpanded: expandedAnalyses.includes('topCompanies'),
      showAnalysisOnly: analysisOnlyCharts.includes('topCompanies'),
      title: "Empresas com Ordens Concluídas",
      analysis: "Ranking das empresas com maior número de ordens concluídas, indicando os principais parceiros em volume de entregas."
    });
  }
  
  if (chartVisibility.districtDistribution) {
    items.push({
      id: 'districtDistribution',
      component: <NeighborhoodsChart 
        data={prepareChartData(chartData?.districtDistribution)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('districtDistribution'),
      isAnalysisExpanded: expandedAnalyses.includes('districtDistribution'),
      showAnalysisOnly: analysisOnlyCharts.includes('districtDistribution'),
      title: "Ordens por Subprefeitura",
      analysis: "Distribuição geográfica das ordens de serviço, mostrando quais regiões têm maior demanda de intervenções."
    });
  }
  
  if (chartVisibility.servicesByDepartment) {
    items.push({
      id: 'servicesByDepartment',
      component: <ServiceTypesChart 
        data={prepareChartData(chartData?.servicesByDepartment)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('servicesByDepartment'),
      isAnalysisExpanded: expandedAnalyses.includes('servicesByDepartment'),
      showAnalysisOnly: analysisOnlyCharts.includes('servicesByDepartment'),
      title: "Serviços por Departamento",
      analysis: "Visualização dos tipos de serviços distribuídos por departamento técnico, indicando áreas de especialização."
    });
  }
  
  if (chartVisibility.servicesByDistrict) {
    items.push({
      id: 'servicesByDistrict',
      component: <ServicesByDistrictChart 
        data={prepareChartData(chartData?.servicesByDistrict)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('servicesByDistrict'),
      isAnalysisExpanded: expandedAnalyses.includes('servicesByDistrict'),
      showAnalysisOnly: analysisOnlyCharts.includes('servicesByDistrict'),
      title: "Serviços por Distrito",
      analysis: "Análise da diversidade de serviços por distrito, permitindo identificar necessidades específicas de cada região."
    });
  }
  
  if (chartVisibility.timeComparison) {
    items.push({
      id: 'timeComparison',
      component: <TimeComparisonChart 
        data={prepareChartData(chartData?.timeComparison)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('timeComparison'),
      isAnalysisExpanded: expandedAnalyses.includes('timeComparison'),
      showAnalysisOnly: analysisOnlyCharts.includes('timeComparison'),
      title: "Comparativo de Tempo Médio",
      analysis: "Comparação do tempo médio de resolução entre diferentes períodos ou tipos de serviço, mostrando evolução da eficiência."
    });
  }
  
  if (chartVisibility.efficiencyImpact) {
    items.push({
      id: 'efficiencyImpact',
      component: <EfficiencyImpactChart 
        data={prepareChartData(chartData?.efficiencyImpact)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('efficiencyImpact'),
      isAnalysisExpanded: expandedAnalyses.includes('efficiencyImpact'),
      showAnalysisOnly: analysisOnlyCharts.includes('efficiencyImpact'),
      title: "Impacto na Eficiência",
      analysis: "Análise do impacto de exclusão de terceiros nos tempos médios de resolução, mostrando potencial interno da equipe."
    });
  }
  
  if (chartVisibility.dailyDemands) {
    items.push({
      id: 'dailyDemands',
      component: <DailyDemandsChart 
        data={prepareChartData(chartData?.dailyDemands)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('dailyDemands'),
      isAnalysisExpanded: expandedAnalyses.includes('dailyDemands'),
      showAnalysisOnly: analysisOnlyCharts.includes('dailyDemands'),
      title: "Volume Diário",
      analysis: "Tendência diária de novas demandas, permitindo identificar picos sazonais e planejar recursos adequadamente."
    });
  }
  
  if (chartVisibility.neighborhoodComparison) {
    items.push({
      id: 'neighborhoodComparison',
      component: <NeighborhoodComparisonChart 
        data={prepareChartData(chartData?.neighborhoodComparison)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('neighborhoodComparison'),
      isAnalysisExpanded: expandedAnalyses.includes('neighborhoodComparison'),
      showAnalysisOnly: analysisOnlyCharts.includes('neighborhoodComparison'),
      title: "Comparativo por Bairros",
      analysis: "Comparação de volume de ordens entre diferentes bairros, indicando áreas com maior necessidade de manutenção."
    });
  }
  
  if (chartVisibility.districtEfficiencyRadar) {
    items.push({
      id: 'districtEfficiencyRadar',
      component: <DistrictEfficiencyRadarChart 
        data={prepareChartData(chartData?.districtEfficiencyRadar)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('districtEfficiencyRadar'),
      isAnalysisExpanded: expandedAnalyses.includes('districtEfficiencyRadar'),
      showAnalysisOnly: analysisOnlyCharts.includes('districtEfficiencyRadar'),
      title: "Radar de Eficiência",
      analysis: "Visualização multidimensional da eficiência de cada distrito em diferentes métricas operacionais."
    });
  }
  
  if (chartVisibility.statusTransition) {
    items.push({
      id: 'statusTransition',
      component: <StatusTransitionChart 
        data={prepareChartData(chartData?.statusTransition)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('statusTransition'),
      isAnalysisExpanded: expandedAnalyses.includes('statusTransition'),
      showAnalysisOnly: analysisOnlyCharts.includes('statusTransition'),
      title: "Transição de Status",
      analysis: "Evolução temporal da transição entre diferentes status, mostrando o fluxo de progresso das ordens."
    });
  }
  
  if (chartVisibility.criticalStatus) {
    items.push({
      id: 'criticalStatus',
      component: <CriticalStatusChart 
        data={prepareChartData(chartData?.criticalStatus)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('criticalStatus'),
      isAnalysisExpanded: expandedAnalyses.includes('criticalStatus'),
      showAnalysisOnly: analysisOnlyCharts.includes('criticalStatus'),
      title: "Status Críticos",
      analysis: "Destaque para ordens em status que requerem atenção especial, ajudando a priorizar intervenções urgentes."
    });
  }
  
  if (chartVisibility.externalDistricts) {
    items.push({
      id: 'externalDistricts',
      component: <ExternalDistrictsChart 
        data={prepareChartData(chartData?.externalDistricts)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('externalDistricts'),
      isAnalysisExpanded: expandedAnalyses.includes('externalDistricts'),
      showAnalysisOnly: analysisOnlyCharts.includes('externalDistricts'),
      title: "Distritos Externos",
      analysis: "Mapeamento de ordens originadas de distritos externos à jurisdição principal, indicando relações interterritoriais."
    });
  }
  
  if (chartVisibility.serviceDiversity) {
    items.push({
      id: 'serviceDiversity',
      component: <ServiceDiversityChart 
        data={prepareChartData(chartData?.serviceDiversity)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('serviceDiversity'),
      isAnalysisExpanded: expandedAnalyses.includes('serviceDiversity'),
      showAnalysisOnly: analysisOnlyCharts.includes('serviceDiversity'),
      title: "Diversidade de Serviços",
      analysis: "Análise da variedade de serviços executados por cada departamento técnico, mostrando áreas de especialização."
    });
  }
  
  if (chartVisibility.closureTime) {
    items.push({
      id: 'closureTime',
      component: <ClosureTimeChart 
        data={prepareChartData(chartData?.closureTime)} 
        isLoading={isLoading} 
      />,
      isVisible: !hiddenCharts.includes('closureTime'),
      isAnalysisExpanded: expandedAnalyses.includes('closureTime'),
      showAnalysisOnly: analysisOnlyCharts.includes('closureTime'),
      title: "Tempo até Fechamento",
      analysis: "Estimativa do tempo médio até o fechamento completo de diferentes tipos de ordens, ajudando no planejamento de recursos."
    });
  }
  
  return items;
};
