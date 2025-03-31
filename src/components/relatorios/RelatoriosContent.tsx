
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRelatorioItemsState } from './hooks/useRelatorioItemsState';
import { createRelatorioItems } from './utils/relatorioItemsFactory';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useChartData } from './hooks/useChartData';
import { useChartComponents } from './hooks/useChartComponents';
import TemasTecnicos from './sections/TemasTecnicos';
import TempoDesempenho from './sections/TempoDesempenho';
import NotasOficiais from './sections/NotasOficiais';
import Tendencias from './sections/Tendencias';
import { useReportsData } from './hooks/useReportsData';
import StatsCards from './components/StatsCards';

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
  
  const { reportsData, cardStats, isLoading: dataLoading } = useReportsData({
    dateRange
  });
  
  const { chartData } = useChartData();
  
  const {
    chartComponents
  } = useChartComponents();

  const initialItems = React.useMemo(() => createRelatorioItems({
    chartData,
    chartComponents,
    isLoading: isLoading || dataLoading,
    hiddenItems: [],
    expandedAnalyses: [],
    analysisOnlyItems: []
  }), [chartComponents, chartData, isLoading, dataLoading]);

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
    // Definir um timer para simular carregamento, mas se os dados reais já estiverem prontos, termine mais cedo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, dataLoading ? 1500 : 500);
    
    return () => clearTimeout(timer);
  }, [dataLoading]);

  const temasTecnicosItems = items.filter(item => ['distribuicaoPorTemas', 'complexidadePorTema', 'origemDemandas'].includes(item.id));
  const tempoDesempenhoItems = items.filter(item => ['tempoMedioResposta', 'performanceArea', 'timelineRespostas'].includes(item.id));
  const notasOficiaisItems = items.filter(item => ['notasEmitidas', 'notasPorTema', 'distribuicaoImpacto'].includes(item.id));
  const tendenciasItems = items.filter(item => ['evolucaoMensal', 'comparativoAnual', 'indiceSatisfacao'].includes(item.id));

  const loading = isLoading || dataLoading;

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
        <StatsCards cardStats={cardStats} isLoading={loading} />
        
        <TemasTecnicos 
          items={temasTecnicosItems} 
          isLoading={loading}
          handleToggleVisibility={handleToggleVisibility}
          handleToggleAnalysis={handleToggleAnalysis}
          handleToggleView={handleToggleView}
        />
        
        <TempoDesempenho
          items={tempoDesempenhoItems}
          isLoading={loading}
          handleToggleVisibility={handleToggleVisibility}
          handleToggleAnalysis={handleToggleAnalysis}
          handleToggleView={handleToggleView}
        />
        
        <NotasOficiais
          items={notasOficiaisItems}
          isLoading={loading}
          handleToggleVisibility={handleToggleVisibility}
          handleToggleAnalysis={handleToggleAnalysis}
          handleToggleView={handleToggleView}
        />
        
        <Tendencias
          items={tendenciasItems}
          isLoading={loading}
          handleToggleVisibility={handleToggleVisibility}
          handleToggleAnalysis={handleToggleAnalysis}
          handleToggleView={handleToggleView}
        />
      </motion.div>
    </DndContext>
  );
};

export default RelatoriosContent;
