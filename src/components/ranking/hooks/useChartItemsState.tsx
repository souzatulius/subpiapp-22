
import React, { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { ChartItem } from '../types';

export { ChartItem };

export const useChartItemsState = (initialItems: ChartItem[]) => {
  const [items, setItems] = useState<ChartItem[]>(initialItems);
  
  const [hiddenCharts, setHiddenCharts] = useState<string[]>([]);
  const [expandedAnalyses, setExpandedAnalyses] = useState<string[]>([]);
  const [analysisOnlyCharts, setAnalysisOnlyCharts] = useState<string[]>([]);
  
  // Handle drag end event for chart reordering
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    setItems((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      return arrayMove(items, oldIndex, newIndex);
    });
  }, []);
  
  // Toggle chart visibility
  const handleToggleVisibility = useCallback((id: string) => {
    setHiddenCharts(prevHidden => {
      if (prevHidden.includes(id)) {
        return prevHidden.filter(itemId => itemId !== id);
      } else {
        return [...prevHidden, id];
      }
    });
  }, []);
  
  // Toggle analysis expanded state
  const handleToggleAnalysis = useCallback((id: string) => {
    setExpandedAnalyses(prevExpanded => {
      if (prevExpanded.includes(id)) {
        return prevExpanded.filter(itemId => itemId !== id);
      } else {
        return [...prevExpanded, id];
      }
    });
  }, []);
  
  // Toggle between chart and analysis view
  const handleToggleView = useCallback((id: string) => {
    setAnalysisOnlyCharts(prevAnalysisOnly => {
      if (prevAnalysisOnly.includes(id)) {
        return prevAnalysisOnly.filter(itemId => itemId !== id);
      } else {
        return [...prevAnalysisOnly, id];
      }
    });
  }, []);
  
  return {
    items, 
    setItems,
    hiddenCharts,
    expandedAnalyses,
    analysisOnlyCharts,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  };
};

// Helper function to generate random analysis text based on chart title
export function generateFakeAnalysis(chartTitle: string): string {
  const insights = [
    "Os dados apresentam uma tendência de crescimento constante ao longo do período analisado.",
    "Observa-se uma redução significativa nos valores comparados ao trimestre anterior.",
    "Há picos de atividade que coincidem com períodos sazonais específicos.",
    "A comparação entre departamentos mostra diferenças significativas nos resultados.",
    "Os indicadores sugerem uma correlação positiva entre os fatores analisados.",
    "A análise de tendência aponta para uma estabilização dos valores nos próximos períodos.",
    "As flutuações observadas estão dentro da margem de erro esperada para este tipo de métrica.",
    "Os resultados superaram as expectativas estabelecidas no planejamento estratégico.",
    "Existe uma oportunidade de melhoria identificada nos segmentos com desempenho abaixo da média."
  ];

  // Select 2-3 random insights
  const numberOfInsights = Math.floor(Math.random() * 2) + 2;
  const selectedInsights = [];
  
  for (let i = 0; i < numberOfInsights; i++) {
    const randomIndex = Math.floor(Math.random() * insights.length);
    selectedInsights.push(insights[randomIndex]);
    insights.splice(randomIndex, 1);
  }
  
  // Create a custom intro based on chart title
  let intro = `Análise de ${chartTitle}: `;
  
  return intro + selectedInsights.join(' ') + ' Recomenda-se o monitoramento contínuo destes indicadores para identificar tendências futuras e implementar ações corretivas quando necessário.';
}

export default useChartItemsState;
