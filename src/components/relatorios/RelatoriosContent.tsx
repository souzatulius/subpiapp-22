
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRelatorioItemsState } from './hooks/useRelatorioItemsState';
import { createRelatorioItems } from './utils/relatorioItemsFactory';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useChartComponents } from './hooks/useChartComponents';
import TemasTecnicos from './sections/TemasTecnicos';
import TempoDesempenho from './sections/TempoDesempenho';
import NotasOficiais from './sections/NotasOficiais';
import { useReportsData, ReportFilters } from './hooks/useReportsData';
import StatsCards from './components/StatsCards';
import { DateRange } from "react-day-picker";

interface RelatoriosContentProps {
  filterDialogOpen?: boolean;
  setFilterDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  filters?: ReportFilters;
}

export const RelatoriosContent: React.FC<RelatoriosContentProps> = ({ 
  filterDialogOpen, 
  setFilterDialogOpen,
  filters = {}
}) => {
  const defaultDateRange: DateRange = {
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  };
  
  const [dateRange, setDateRange] = React.useState<DateRange>(defaultDateRange);
  const [isLoading, setIsLoading] = useState(true);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  
  const currentFilters = {
    ...filters,
    dateRange: filters.dateRange || dateRange
  };
  
  // Acompanhe o carregamento de dados com console logs
  console.log('RelatoriosContent - currentFilters:', currentFilters);
  
  const { reportsData, cardStats, isLoading: dataLoading } = useReportsData(currentFilters);
  
  console.log('RelatoriosContent - reportsData:', reportsData);
  console.log('RelatoriosContent - cardStats:', cardStats);
  
  const { chartComponents } = useChartComponents();

  const initialItems = React.useMemo(() => createRelatorioItems({
    chartData: reportsData || {},
    chartComponents,
    isLoading: isLoading || dataLoading,
    hiddenItems: [],
    expandedAnalyses: [],
    analysisOnlyItems: []
  }), [chartComponents, isLoading, dataLoading, reportsData]);

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
    }, dataLoading ? 800 : 300);  // Reduzindo os tempos para melhorar a percepção de performance
    
    return () => clearTimeout(timer);
  }, [dataLoading]);

  const temasTecnicosItems = items.filter(item => ['distribuicaoPorTemas', 'origemDemandas'].includes(item.id));
  const tempoDesempenhoItems = items.filter(item => ['tempoMedioResposta', 'performanceArea'].includes(item.id));
  const notasOficiaisItems = items.filter(item => ['notasEmitidas'].includes(item.id));

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
      </motion.div>
    </DndContext>
  );
};

export default RelatoriosContent;
