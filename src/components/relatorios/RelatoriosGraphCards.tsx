
import React, { useState } from 'react';
import { SortableGraphCard } from './components/SortableGraphCard';
import { useReportsData } from './hooks/useReportsData';
import { useChartComponents } from './hooks/useChartComponents';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { AlertCircle, BarChart3, PieChart, LineChart, TrendingUp, Clock, Users, MessageSquare, ThumbsUp } from 'lucide-react';
import { BarChart } from './charts/BarChart';
import { LineChart as LineChartComponent } from './charts/LineChart';
import { PieChart as PieChartComponent } from './charts/PieChart';
import { AreaChart } from './charts/AreaChart';

interface GraphCardItem {
  id: string;
  title: string;
  description?: string;
  visible: boolean;
  showAnalysis: boolean;
  analysis?: string;
}

interface RelatoriosGraphCardsProps {
  isEditMode?: boolean;
}

export const RelatoriosGraphCards: React.FC<RelatoriosGraphCardsProps> = ({ isEditMode = false }) => {
  const { reportsData, isLoading } = useReportsData();
  const { chartComponents } = useChartComponents();
  const [visibleCards, setVisibleCards] = useLocalStorage<string[]>('relatorios-graph-visible', [
    'distribuicaoPorTemas', 'origemDemandas', 'tempoMedioResposta', 'performanceArea',
    'notasEmitidas', 'notasPorTema', 'evolucaoMensal', 'indiceSatisfacao'
  ]);
  
  const [cardsOrder, setCardsOrder] = useLocalStorage<string[]>('relatorios-graph-order', [
    'distribuicaoPorTemas', 'origemDemandas', 'tempoMedioResposta', 'performanceArea',
    'notasEmitidas', 'notasPorTema', 'evolucaoMensal', 'indiceSatisfacao'
  ]);
  
  const [analysisCards, setAnalysisCards] = useLocalStorage<string[]>('relatorios-graph-analysis', []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = cardsOrder.indexOf(active.id.toString());
      const newIndex = cardsOrder.indexOf(over.id.toString());
      
      setCardsOrder(arrayMove(cardsOrder, oldIndex, newIndex));
    }
  };

  const handleToggleVisibility = (cardId: string) => {
    setVisibleCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId) 
        : [...prev, cardId]
    );
  };

  const handleToggleAnalysis = (cardId: string) => {
    setAnalysisCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId) 
        : [...prev, cardId]
    );
  };

  // Dados fictícios para os gráficos
  const mockBarData = [
    { name: 'Tema 1', Quantidade: 45 },
    { name: 'Tema 2', Quantidade: 32 },
    { name: 'Tema 3', Quantidade: 18 },
    { name: 'Tema 4', Quantidade: 25 },
    { name: 'Tema 5', Quantidade: 15 },
  ];

  const mockLineData = [
    { name: 'Jan', Demandas: 12, Respostas: 10 },
    { name: 'Fev', Demandas: 15, Respostas: 14 },
    { name: 'Mar', Demandas: 18, Respostas: 16 },
    { name: 'Abr', Demandas: 22, Respostas: 19 },
    { name: 'Mai', Demandas: 20, Respostas: 18 },
    { name: 'Jun', Demandas: 25, Respostas: 22 },
  ];

  const mockPieData = [
    { name: 'Concluídas', value: 35 },
    { name: 'Em andamento', value: 25 },
    { name: 'Pendentes', value: 15 },
    { name: 'Canceladas', value: 5 },
  ];

  const mockAreaData = [
    { name: 'Jan', Quantidade: 10, Meta: 12 },
    { name: 'Fev', Quantidade: 15, Meta: 12 },
    { name: 'Mar', Quantidade: 12, Meta: 12 },
    { name: 'Abr', Quantidade: 18, Meta: 15 },
    { name: 'Mai', Quantidade: 22, Meta: 15 },
    { name: 'Jun', Quantidade: 20, Meta: 18 },
  ];

  // Card definitions
  const cardsData: Record<string, GraphCardItem> = {
    distribuicaoPorTemas: {
      id: 'distribuicaoPorTemas',
      title: 'Distribuição por Temas',
      description: 'Quantidade de demandas por tema',
      visible: visibleCards.includes('distribuicaoPorTemas'),
      showAnalysis: analysisCards.includes('distribuicaoPorTemas'),
      analysis: 'Os temas com maior demanda são: Manutenção (32%), Zeladoria (25%) e Segurança (18%). É importante direcionar recursos para essas áreas prioritárias.'
    },
    origemDemandas: {
      id: 'origemDemandas',
      title: 'Origem das Demandas',
      description: 'Canais de entrada das solicitações',
      visible: visibleCards.includes('origemDemandas'),
      showAnalysis: analysisCards.includes('origemDemandas'),
      analysis: 'O canal predominante é o portal web (45%), seguido por WhatsApp (30%) e telefone (15%). Há oportunidade de melhorar a experiência nos canais digitais.'
    },
    tempoMedioResposta: {
      id: 'tempoMedioResposta',
      title: 'Tempo Médio de Resposta',
      description: 'Tempo (em dias) até o primeiro atendimento',
      visible: visibleCards.includes('tempoMedioResposta'),
      showAnalysis: analysisCards.includes('tempoMedioResposta'),
      analysis: 'Notamos uma redução de 15% no tempo médio de resposta nos últimos 3 meses, com melhoria mais significativa nas demandas de prioridade alta.'
    },
    performanceArea: {
      id: 'performanceArea',
      title: 'Performance por Área',
      description: 'Taxa de resolução por departamento',
      visible: visibleCards.includes('performanceArea'),
      showAnalysis: analysisCards.includes('performanceArea'),
      analysis: 'A Coordenadoria de Manutenção apresenta o melhor desempenho com 92% de solicitações atendidas dentro do prazo, enquanto Obras está com 68%.'
    },
    notasEmitidas: {
      id: 'notasEmitidas',
      title: 'Notas Emitidas',
      description: 'Quantidade de notas oficiais por período',
      visible: visibleCards.includes('notasEmitidas'),
      showAnalysis: analysisCards.includes('notasEmitidas'),
      analysis: 'Observa-se um aumento de 23% na emissão de notas oficiais em comparação ao trimestre anterior, com maior incidência em temas urbanos.'
    },
    notasPorTema: {
      id: 'notasPorTema',
      title: 'Notas por Tema',
      description: 'Distribuição temática das notas oficiais',
      visible: visibleCards.includes('notasPorTema'),
      showAnalysis: analysisCards.includes('notasPorTema'),
      analysis: 'Eventos públicos (28%) e Obras (22%) representam metade das notas emitidas, refletindo as prioridades da comunicação institucional.'
    },
    evolucaoMensal: {
      id: 'evolucaoMensal',
      title: 'Evolução Mensal',
      description: 'Comparativo mensal de demandas e respostas',
      visible: visibleCards.includes('evolucaoMensal'),
      showAnalysis: analysisCards.includes('evolucaoMensal'),
      analysis: 'Detectamos um padrão sazonal com picos de demanda em março e outubro, sugerindo planejamento antecipado de recursos para estes períodos.'
    },
    indiceSatisfacao: {
      id: 'indiceSatisfacao',
      title: 'Índice de Satisfação',
      description: 'Avaliação do atendimento pelo cidadão',
      visible: visibleCards.includes('indiceSatisfacao'),
      showAnalysis: analysisCards.includes('indiceSatisfacao'),
      analysis: 'A satisfação geral é de 78%, com avaliações mais altas para Parques (89%) e mais baixas para Iluminação (63%), indicando áreas para melhoria.'
    }
  };

  // Componentes de gráfico baseados nos dados de exemplo
  const demoChartComponents: Record<string, React.ReactNode> = {
    distribuicaoPorTemas: <BarChart data={mockBarData} xAxisDataKey="name" bars={[{ dataKey: 'Quantidade', name: 'Quantidade', color: '#f97316' }]} />,
    origemDemandas: <PieChartComponent data={mockPieData} colors={['#f97316', '#fb923c', '#fdba74', '#fff7ed']} />,
    tempoMedioResposta: <LineChartComponent data={mockLineData} xAxisDataKey="name" lines={[{ dataKey: 'Demandas', name: 'Demandas', color: '#f97316' }, { dataKey: 'Respostas', name: 'Respostas', color: '#7c2d12' }]} />,
    performanceArea: <BarChart data={mockBarData} xAxisDataKey="name" bars={[{ dataKey: 'Quantidade', name: 'Taxa (%)', color: '#f97316' }]} />,
    notasEmitidas: <LineChartComponent data={mockLineData} xAxisDataKey="name" lines={[{ dataKey: 'Demandas', name: 'Quantidade', color: '#f97316' }]} />,
    notasPorTema: <PieChartComponent data={mockPieData} colors={['#f97316', '#fb923c', '#fdba74', '#fff7ed']} />,
    evolucaoMensal: <AreaChart data={mockAreaData} xAxisDataKey="name" areas={[{ dataKey: 'Quantidade', name: 'Quantidade', color: '#fdba74', fillOpacity: 0.6 }, { dataKey: 'Meta', name: 'Meta', color: '#f97316', fillOpacity: 0.3 }]} />,
    indiceSatisfacao: <BarChart data={mockBarData} xAxisDataKey="name" bars={[{ dataKey: 'Quantidade', name: 'Satisfação (%)', color: '#f97316' }]} />,
  };

  // Icons for the cards
  const cardIcons: Record<string, React.ReactNode> = {
    distribuicaoPorTemas: <BarChart3 className="h-5 w-5 text-orange-500" />,
    origemDemandas: <PieChart className="h-5 w-5 text-orange-500" />,
    tempoMedioResposta: <Clock className="h-5 w-5 text-orange-500" />,
    performanceArea: <TrendingUp className="h-5 w-5 text-orange-500" />,
    notasEmitidas: <LineChart className="h-5 w-5 text-orange-500" />,
    notasPorTema: <MessageSquare className="h-5 w-5 text-orange-500" />,
    evolucaoMensal: <TrendingUp className="h-5 w-5 text-orange-500" />,
    indiceSatisfacao: <ThumbsUp className="h-5 w-5 text-orange-500" />,
  };

  // Render a placeholder message when there's not enough data
  const renderEmptyDataMessage = (cardId: string) => (
    <div className="h-[250px] flex flex-col items-center justify-center text-slate-400 p-4 text-center">
      <AlertCircle className="h-10 w-10 mb-3 text-orange-300" />
      <h4 className="font-medium text-slate-500 mb-1">Dados insuficientes</h4>
      <p className="text-sm">
        Não há dados suficientes para gerar este gráfico. Por favor, verifique os filtros aplicados ou tente novamente mais tarde.
      </p>
    </div>
  );

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={cardsOrder}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardsOrder
            .filter(cardId => visibleCards.includes(cardId))
            .map((cardId) => {
              const card = cardsData[cardId];
              const chartComponent = demoChartComponents[cardId] || chartComponents[cardId];
              
              return (
                <SortableGraphCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  isVisible={card.visible}
                  showAnalysis={card.showAnalysis}
                  analysis={card.analysis}
                  isLoading={isLoading}
                  onToggleVisibility={() => handleToggleVisibility(card.id)}
                  onToggleAnalysis={() => handleToggleAnalysis(card.id)}
                >
                  {isLoading ? (
                    <div className="h-[250px] flex items-center justify-center">
                      <div className="h-8 w-8 border-4 border-t-orange-500 border-r-transparent border-b-orange-300 border-l-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : chartComponent ? (
                    <div className="h-[250px] p-2">
                      {chartComponent}
                    </div>
                  ) : (
                    renderEmptyDataMessage(card.id)
                  )}
                </SortableGraphCard>
              );
            })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
