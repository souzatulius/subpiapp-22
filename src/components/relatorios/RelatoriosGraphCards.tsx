import React, { useState } from 'react';
import { SortableGraphCard } from './components/SortableGraphCard';
import { useReportsData } from './hooks/useReportsData';
import { useChartComponents } from './hooks/useChartComponents';
import { useChartConfigs } from './hooks/charts/useChartConfigs';
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
  const { chartColors } = useChartConfigs();
  
  const [visibleCards, setVisibleCards] = useLocalStorage<string[]>('relatorios-graph-visible', [
    'distribuicaoPorTemas', 'origemDemandas', 'tempoMedioResposta', 'performanceArea',
    'notasEmitidas'
  ]);
  
  const [cardsOrder, setCardsOrder] = useLocalStorage<string[]>('relatorios-graph-order', [
    'distribuicaoPorTemas', 'origemDemandas', 'tempoMedioResposta', 'performanceArea',
    'notasEmitidas'
  ]);
  
  const [analysisCards, setAnalysisCards] = useLocalStorage<string[]>('relatorios-graph-analysis', []);

  const cardsData: Record<string, GraphCardItem> = {
    distribuicaoPorTemas: {
      id: 'distribuicaoPorTemas',
      title: 'Problemas mais frequentes',
      description: 'Temas das solicitações no mês atual',
      visible: true,
      showAnalysis: analysisCards.includes('distribuicaoPorTemas'),
      analysis: 'Os temas com maior volume de demandas são Serviços Urbanos e Meio Ambiente.'
    },
    origemDemandas: {
      id: 'origemDemandas',
      title: 'Origem das Demandas',
      description: 'De onde vêm as solicitações',
      visible: true,
      showAnalysis: analysisCards.includes('origemDemandas'),
      analysis: 'A maioria das demandas vem diretamente das coordenações, seguidas de imprensa e redes sociais.'
    },
    tempoMedioResposta: {
      id: 'tempoMedioResposta',
      title: 'Tempo Médio de Resposta',
      description: 'Evolução de agilidade de retorno para a imprensa',
      visible: true,
      showAnalysis: analysisCards.includes('tempoMedioResposta'),
      analysis: 'O tempo médio de resposta tem diminuído nos últimos meses, indicando melhoria na eficiência.'
    },
    performanceArea: {
      id: 'performanceArea',
      title: 'Áreas mais acionadas',
      description: 'Coordenações mais envolvidas nas solicitações',
      visible: true,
      showAnalysis: analysisCards.includes('performanceArea'),
      analysis: 'As áreas de Comunicação e Planejamento têm os melhores índices de resposta.'
    },
    notasEmitidas: {
      id: 'notasEmitidas',
      title: 'Notas de Imprensa',
      description: 'Evolução de posicionamentos no mês',
      visible: true,
      showAnalysis: analysisCards.includes('notasEmitidas'),
      analysis: 'Houve um aumento de 15% na emissão de notas oficiais no último trimestre.'
    }
  };

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

  const mockBarData = [
    { name: 'Poda de Árvores', Quantidade: 45 },
    { name: 'Bueiros', Quantidade: 32 },
    { name: 'Remoção de galhos', Quantidade: 18 },
    { name: 'Lixo', Quantidade: 25 },
    { name: 'Parques e praças', Quantidade: 15 },
  ];

  const mockLineData = [
    { name: 'Jan', Demandas: 12, Respostas: 10 },
    { name: 'Fev', Demandas: 15, Respostas: 14 },
    { name: 'Mar', Demandas: 18, Respostas: 16 },
    { name: 'Abr', Demandas: 22, Respostas: 19 }
  ];

  const mockPieData = [
    { name: 'Imprensa', value: 35 },
    { name: 'SMSUB', value: 45 },
    { name: 'Internas', value: 20 },
  ];

  const mockAreasData = [
    { name: 'CPO', Quantidade: 92 },
    { name: 'CPDU', Quantidade: 87 },
    { name: 'Governo Local', Quantidade: 82 },
    { name: 'Jurídico', Quantidade: 75 },
    { name: 'Finanças', Quantidade: 68 },
  ];

  const mockAreaData = [
    { name: 'Jan', Quantidade: 10, Meta: 12 },
    { name: 'Fev', Quantidade: 15, Meta: 12 },
    { name: 'Mar', Quantidade: 12, Meta: 12 },
    { name: 'Abr', Quantidade: 18, Meta: 15 },
    { name: 'Mai', Quantidade: 22, Meta: 15 },
    { name: 'Jun', Quantidade: 20, Meta: 18 },
  ];

  const demoChartComponents: Record<string, React.ReactNode> = {
    distribuicaoPorTemas: <BarChart data={mockBarData} xAxisDataKey="name" bars={[{ dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }]} />,
    origemDemandas: <PieChartComponent data={mockPieData} colors={[chartColors[0], chartColors[1], chartColors[3]]} showOnlyPercentage={true} showLabels={false} />,
    tempoMedioResposta: <LineChartComponent data={mockLineData} xAxisDataKey="name" yAxisTicks={[10, 20, 50, 60, 90]} lines={[{ dataKey: 'Demandas', name: 'Respostas da coordenação', color: chartColors[0] }, { dataKey: 'Respostas', name: 'Aprovação da nota', color: chartColors[2] }]} />,
    performanceArea: <BarChart data={mockAreasData} xAxisDataKey="name" bars={[{ dataKey: 'Quantidade', name: 'Demandas no mês', color: chartColors[1] }]} />,
    notasEmitidas: <LineChartComponent data={mockLineData} xAxisDataKey="name" lines={[{ dataKey: 'Demandas', name: 'Quantidade', color: chartColors[1] }]} />,
  };

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
