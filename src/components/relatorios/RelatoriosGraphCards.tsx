import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { BarChart, PieChart, TrendingUp, Calendar, AlertCircle, Newspaper, MessageSquare } from 'lucide-react';
import TemasTecnicos from './sections/TemasTecnicos';
import NotasOficiais from './sections/NotasOficiais';
import Tendencias from './sections/Tendencias';
import TempoDesempenho from './sections/TempoDesempenho';
import { RelatorioItem } from './hooks/useRelatorioItemsState';
import ESICProcessesChart from './charts/ESICProcessesChart';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RelatoriosGraphCardsProps {
  chartVisibility: Record<string, boolean>;
  chartPositions: Record<string, number>;
  setChartPositions: (positions: Record<string, number>) => void;
}

const DEFAULT_STATS = {
  total: 24,
  responded: 18,
  justified: 12,
};

const RelatoriosGraphCards: React.FC<RelatoriosGraphCardsProps> = ({ 
  chartVisibility,
  chartPositions,
  setChartPositions
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [esicStats, setEsicStats] = useState(DEFAULT_STATS);
  const [items, setItems] = useLocalStorage<RelatorioItem[]>('relatorios-items', []);
  
  // Function to toggle chart visibility
  const handleToggleVisibility = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };
  
  // Function to toggle analysis view
  const handleToggleAnalysis = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isAnalysisExpanded: !item.isAnalysisExpanded } : item
      )
    );
  };
  
  // Function to toggle between chart and analysis
  const handleToggleView = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, showAnalysisOnly: !item.showAnalysisOnly } : item
      )
    );
  };

  // Load ESIC data for the processes chart
  useEffect(() => {
    const fetchESICStats = async () => {
      setIsLoading(true);
      try {
        // Get total count
        const { count: total } = await supabase
          .from('esic_processos')
          .select('*', { count: 'exact', head: true });
        
        // Get responded count
        const { count: responded } = await supabase
          .from('esic_processos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'concluido');
        
        // Get justified count
        const { count: justified } = await supabase
          .from('esic_justificativas')
          .select('*', { count: 'exact', head: true });
        
        setEsicStats({
          total: total || DEFAULT_STATS.total,
          responded: responded || DEFAULT_STATS.responded,
          justified: justified || DEFAULT_STATS.justified
        });
      } catch (error) {
        console.error('Error fetching ESIC stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchESICStats();
  }, []);

  // Define chart sections
  const sections = [
    {
      id: 'temas-tecnicos',
      title: 'Temas Técnicos',
      items: [
        {
          id: 'distribuicaoPorTemas',
          title: 'Distribuição por Temas',
          value: '36% Zeladoria',
          analysis: 'Zeladoria representa a maior parte das demandas, seguida por infraestrutura urbana.',
          isVisible: chartVisibility.distribuicaoPorTemas !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico de distribuição por temas</div>
        }
      ]
    },
    {
      id: 'notas-oficiais',
      title: 'Notas Oficiais',
      items: [
        {
          id: 'notasEmitidas',
          title: 'Notas Emitidas',
          value: '215 notas',
          analysis: 'Aumento de 5% em relação ao período anterior.',
          isVisible: chartVisibility.notasEmitidas !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico de notas emitidas</div>
        },
        {
          id: 'noticiasVsReleases',
          title: 'Notícias vs Releases',
          value: '3:1',
          analysis: 'Para cada release, são publicadas em média 3 notícias independentes.',
          isVisible: chartVisibility.noticiasVsReleases !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico comparativo</div>
        }
      ]
    },
    {
      id: 'tempo-desempenho',
      title: 'Tempo e Desempenho',
      items: [
        {
          id: 'tempoMedioResposta',
          title: 'Tempo Médio de Resposta',
          value: '36 horas',
          analysis: 'Melhora de 8% em relação ao período anterior.',
          isVisible: chartVisibility.tempoMedioResposta !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico de tempo médio</div>
        },
        {
          id: 'performanceArea',
          title: 'Performance por Área',
          value: 'GAB: 12h',
          analysis: 'Gabinete apresenta o menor tempo médio de resposta.',
          isVisible: chartVisibility.performanceArea !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico de performance por área</div>
        }
      ]
    },
    {
      id: 'tendencias',
      title: 'Tendências',
      items: [
        {
          id: 'origemDemandas',
          title: 'Origem das Demandas',
          value: '42% Imprensa',
          analysis: 'Imprensa é a principal origem das demandas, seguida por cidadãos e associações.',
          isVisible: chartVisibility.origemDemandas !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico de origem de demandas</div>
        },
        {
          id: 'problemasComuns',
          title: 'Problemas Mais Comuns',
          value: 'Zeladoria: 36%',
          analysis: 'Problemas de zeladoria são os mais comuns, seguidos por questões de infraestrutura.',
          isVisible: chartVisibility.problemasComuns !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico de problemas comuns</div>
        },
        {
          id: 'demandasEsic',
          title: 'Demandas e-SIC',
          value: `${esicStats.total} solicitações`,
          analysis: `${Math.round((esicStats.responded / esicStats.total) * 100)}% das solicitações foram respondidas.`,
          isVisible: chartVisibility.demandasEsic !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico de demandas e-SIC</div>
        },
        {
          id: 'resolucaoEsic',
          title: 'Resolução e-SIC',
          value: `${esicStats.responded} resolvidas`,
          analysis: `${Math.round((esicStats.justified / esicStats.total) * 100)}% das solicitações possuem justificativas formalizadas.`,
          isVisible: chartVisibility.resolucaoEsic !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <div className="h-60 flex items-center justify-center">Gráfico de resolução e-SIC</div>
        },
        {
          id: 'processosCadastrados',
          title: 'Processos e Justificativas',
          value: `${esicStats.justified} justif.`,
          analysis: `Para ${esicStats.total} processos, existem ${esicStats.justified} justificativas (${Math.round((esicStats.justified / esicStats.total) * 100)}% de cobertura).`,
          isVisible: chartVisibility.processosCadastrados !== false,
          isAnalysisExpanded: false,
          showAnalysisOnly: false,
          component: <ESICProcessesChart 
                       total={esicStats.total} 
                       responded={esicStats.responded} 
                       justified={esicStats.justified}
                       isLoading={isLoading} 
                     />
        }
      ]
    }
  ];

  // Flatten all items for rendering
  const allItems = sections.flatMap(section => section.items);

  return (
    <div className="space-y-8">
      <TemasTecnicos
        items={sections.find(s => s.id === 'temas-tecnicos')?.items || []}
        isLoading={isLoading}
        handleToggleVisibility={handleToggleVisibility}
        handleToggleAnalysis={handleToggleAnalysis}
        handleToggleView={handleToggleView}
      />
      
      <NotasOficiais
        items={sections.find(s => s.id === 'notas-oficiais')?.items || []}
        isLoading={isLoading}
        handleToggleVisibility={handleToggleVisibility}
        handleToggleAnalysis={handleToggleAnalysis}
        handleToggleView={handleToggleView}
      />
      
      <TempoDesempenho
        items={sections.find(s => s.id === 'tempo-desempenho')?.items || []}
        isLoading={isLoading}
        handleToggleVisibility={handleToggleVisibility}
        handleToggleAnalysis={handleToggleAnalysis}
        handleToggleView={handleToggleView}
      />
      
      <Tendencias
        items={sections.find(s => s.id === 'tendencias')?.items || []}
        isLoading={isLoading}
        handleToggleVisibility={handleToggleVisibility}
        handleToggleAnalysis={handleToggleAnalysis}
        handleToggleView={handleToggleView}
      />
    </div>
  );
};

export default RelatoriosGraphCards;
