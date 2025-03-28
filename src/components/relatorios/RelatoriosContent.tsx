
import React, { useState, useEffect } from 'react';
import { PieChart } from './charts/PieChart';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';
import { AreaChart } from './charts/AreaChart';
import { motion } from 'framer-motion';
import SortableRelatorioCard from './components/SortableRelatorioCard';
import { useRelatorioItemsState } from './hooks/useRelatorioItemsState';
import { createRelatorioItems } from './utils/relatorioItemsFactory';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import ChartSectionWrapper from './components/ChartSectionWrapper';
import { useChartData } from './hooks/useChartData';
import { useChartComponents } from './hooks/useChartComponents';
import ServiceDiversityChart from '../ranking/charts/ServiceDiversityChart';
import ServicesByDistrictChart from '../ranking/charts/ServicesByDistrictChart';
import ServiceTypesChart from '../ranking/charts/ServiceTypesChart';
import StatusDistributionChart from '../ranking/charts/StatusDistributionChart';
import StatusTransitionChart from '../ranking/charts/StatusTransitionChart';
import TimeComparisonChart from '../ranking/charts/TimeComparisonChart';
import TopCompaniesChart from '../ranking/charts/TopCompaniesChart';

interface RelatoriosContentProps {
  filterDialogOpen?: boolean;
  setFilterDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RelatoriosContent: React.FC<RelatoriosContentProps> = () => {
  const [dateRange] = React.useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  
  // Get chart data from the hook
  const { chartData, rankingChartData, rankingData } = useChartData();
  
  // Get chart components from the hook
  const {
    chartComponents
  } = useChartComponents();

  const initialItems = React.useMemo(() => createRelatorioItems({
    chartData,
    chartComponents,
    isLoading,
    hiddenItems: [],
    expandedAnalyses: [],
    analysisOnlyItems: []
  }), [chartComponents, chartData, isLoading]);

  const {
    items,
    hiddenItems,
    expandedAnalyses,
    analysisOnlyItems,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  } = useRelatorioItemsState(initialItems);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const temasTecnicosItems = items.filter(item => ['distribuicaoPorTemas', 'complexidadePorTema', 'origemDemandas'].includes(item.id));
  const tempoDesempenhoItems = items.filter(item => ['tempoMedioResposta', 'performanceArea', 'timelineRespostas'].includes(item.id));
  const notasOficiaisItems = items.filter(item => ['notasEmitidas', 'notasPorTema', 'distribuicaoImpacto'].includes(item.id));
  const tendenciasItems = items.filter(item => ['evolucaoMensal', 'comparativoAnual', 'indiceSatisfacao'].includes(item.id));

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Temas Técnicos</h2>
          <SortableContext items={temasTecnicosItems.map(item => item.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {temasTecnicosItems.map((item) => (
                <SortableRelatorioCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  value={item.value}
                  analysis={item.analysis}
                  isVisible={item.isVisible}
                  isAnalysisExpanded={item.isAnalysisExpanded}
                  showAnalysisOnly={item.showAnalysisOnly}
                  isLoading={isLoading}
                  onToggleVisibility={() => handleToggleVisibility(item.id)}
                  onToggleAnalysis={() => handleToggleAnalysis(item.id)}
                  onToggleView={() => handleToggleView(item.id)}
                >
                  {item.component}
                </SortableRelatorioCard>
              ))}
            </div>
          </SortableContext>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tempo e Desempenho</h2>
          <SortableContext items={tempoDesempenhoItems.map(item => item.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tempoDesempenhoItems.map((item) => (
                <SortableRelatorioCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  value={item.value}
                  analysis={item.analysis}
                  isVisible={item.isVisible}
                  isAnalysisExpanded={item.isAnalysisExpanded}
                  showAnalysisOnly={item.showAnalysisOnly}
                  isLoading={isLoading}
                  onToggleVisibility={() => handleToggleVisibility(item.id)}
                  onToggleAnalysis={() => handleToggleAnalysis(item.id)}
                  onToggleView={() => handleToggleView(item.id)}
                >
                  {item.component}
                </SortableRelatorioCard>
              ))}
            </div>
          </SortableContext>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Notas Oficiais</h2>
          <SortableContext items={notasOficiaisItems.map(item => item.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notasOficiaisItems.map((item) => (
                <SortableRelatorioCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  value={item.value}
                  analysis={item.analysis}
                  isVisible={item.isVisible}
                  isAnalysisExpanded={item.isAnalysisExpanded}
                  showAnalysisOnly={item.showAnalysisOnly}
                  isLoading={isLoading}
                  onToggleVisibility={() => handleToggleVisibility(item.id)}
                  onToggleAnalysis={() => handleToggleAnalysis(item.id)}
                  onToggleView={() => handleToggleView(item.id)}
                >
                  {item.component}
                </SortableRelatorioCard>
              ))}
            </div>
          </SortableContext>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tendências</h2>
          <SortableContext items={tendenciasItems.map(item => item.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tendenciasItems.map((item) => (
                <SortableRelatorioCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  value={item.value}
                  analysis={item.analysis}
                  isVisible={item.isVisible}
                  isAnalysisExpanded={item.isAnalysisExpanded}
                  showAnalysisOnly={item.showAnalysisOnly}
                  isLoading={isLoading}
                  onToggleVisibility={() => handleToggleVisibility(item.id)}
                  onToggleAnalysis={() => handleToggleAnalysis(item.id)}
                  onToggleView={() => handleToggleView(item.id)}
                >
                  {item.component}
                </SortableRelatorioCard>
              ))}
            </div>
          </SortableContext>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ranking de Zeladoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatusDistributionChart 
              data={rankingChartData.statusDistribution} 
              isLoading={isLoading} 
            />
            
            <ServiceTypesChart 
              data={rankingChartData.serviceTypes} 
              isLoading={isLoading} 
            />
            
            <TimeComparisonChart 
              data={rankingChartData.timeComparison} 
              isLoading={isLoading} 
            />
            
            <TopCompaniesChart 
              data={rankingChartData.topCompanies} 
              isLoading={isLoading} 
            />
            
            <ServiceDiversityChart 
              data={rankingChartData.serviceDiversity} 
              isLoading={isLoading} 
            />
            
            <ServicesByDistrictChart 
              data={rankingChartData.servicesByDistrict} 
              isLoading={isLoading} 
            />
            
            <StatusTransitionChart 
              data={rankingChartData.statusTransition} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </motion.div>
    </DndContext>
  );
};
