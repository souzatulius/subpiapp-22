
import React, { useState, useEffect } from 'react';
import { SortableGraphCard } from './components/SortableGraphCard';
import { useReportsData } from './hooks/useReportsData';
import { useChartComponents } from './hooks/useChartComponents';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardsOrder
            .filter(cardId => visibleCards.includes(cardId))
            .map((cardId) => {
              const card = cardsData[cardId];
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
                  isEditMode={isEditMode}
                  onToggleVisibility={() => handleToggleVisibility(card.id)}
                  onToggleAnalysis={() => handleToggleAnalysis(card.id)}
                >
                  {chartComponents[card.id] || <div className="h-[250px] flex items-center justify-center text-slate-400">Gráfico não disponível</div>}
                </SortableGraphCard>
              );
            })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
