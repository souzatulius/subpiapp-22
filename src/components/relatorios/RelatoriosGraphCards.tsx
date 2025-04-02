
import React, { useState } from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { LayoutGrid, BarChart as BarChartIcon } from 'lucide-react';
import { SortableGraphCard } from './components/SortableGraphCard';
import { useChartComponents } from './hooks/useChartComponents';
import { useReportsData } from './hooks/useReportsData';

interface RelatoriosGraphCardsProps {
  currentTheme?: string;
}

export const RelatoriosGraphCards: React.FC<RelatoriosGraphCardsProps> = ({ currentTheme = 'mixed' }) => {
  const [graphOrder, setGraphOrder] = useState([
    'distribuicaoPorTemas', 
    'origemDemandas', 
    'tempoMedioResposta', 
    'performanceArea', 
    'notasEmitidas', 
    'notasPorTema', 
    'evolucaoMensal', 
    'indiceSatisfacao'
  ]);
  
  const [visibilityState, setVisibilityState] = useState({
    distribuicaoPorTemas: true,
    origemDemandas: true,
    tempoMedioResposta: true,
    performanceArea: true,
    notasEmitidas: true,
    notasPorTema: true,
    evolucaoMensal: true,
    indiceSatisfacao: true,
  });

  const [analysisState, setAnalysisState] = useState({
    distribuicaoPorTemas: false,
    origemDemandas: false,
    tempoMedioResposta: false,
    performanceArea: false,
    notasEmitidas: false,
    notasPorTema: false,
    evolucaoMensal: false,
    indiceSatisfacao: false,
  });

  const { isLoading } = useReportsData();
  const { chartComponents } = useChartComponents({ currentTheme });

  // Helper to toggle visibility
  const toggleVisibility = (id: string) => {
    setVisibilityState(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev]
    }));
  };

  // Helper to toggle analysis
  const toggleAnalysis = (id: string) => {
    setAnalysisState(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev]
    }));
  };

  // Sample graph metadata
  const graphsData = {
    distribuicaoPorTemas: {
      id: 'distribuicaoPorTemas',
      title: 'Distribuição por Temas',
      description: 'Segmentação de demandas por categoria',
      analysis: 'Os temas relacionados a manutenção e limpeza representam mais de 60% das demandas recebidas no período, indicando uma área prioritária para alocação de recursos.'
    },
    origemDemandas: {
      id: 'origemDemandas',
      title: 'Origem das Demandas',
      description: 'Canais de entrada das solicitações',
      analysis: 'O portal online é responsável por 37% das entradas, seguido pelo WhatsApp com 25%. A tendência mostra um crescimento nos canais digitais em comparação aos tradicionais.'
    },
    tempoMedioResposta: {
      id: 'tempoMedioResposta',
      title: 'Tempo Médio de Resposta',
      description: 'Evolução mensal do tempo de atendimento',
      analysis: 'Observa-se uma redução consistente no tempo médio de resposta, com queda de 40% nos últimos 6 meses, resultado das melhorias implementadas no fluxo de trabalho.'
    },
    performanceArea: {
      id: 'performanceArea',
      title: 'Performance por Coordenação',
      description: 'Número de demandas atendidas por área',
      analysis: 'As coordenações de Manutenção e Zeladoria são as mais demandadas, respondendo por aproximadamente 50% do volume total de atendimentos no período analisado.'
    },
    notasEmitidas: {
      id: 'notasEmitidas',
      title: 'Notas Oficiais Emitidas',
      description: 'Evolução mensal de comunicados',
      analysis: 'Houve um aumento de 133% na emissão de notas oficiais, refletindo uma política mais ativa de comunicação com o público no último semestre.'
    },
    notasPorTema: {
      id: 'notasPorTema',
      title: 'Notas por Tema',
      description: 'Distribuição temática dos comunicados',
      analysis: 'Comunicados sobre eventos representam 28% do total, seguidos por informações sobre obras (22%), indicando as áreas de maior interesse público.'
    },
    evolucaoMensal: {
      id: 'evolucaoMensal',
      title: 'Evolução Mensal',
      description: 'Comparativo de demandas e respostas',
      analysis: 'A taxa de resposta melhorou significativamente, alcançando 92% de demandas respondidas no último mês, um aumento de 15% em relação ao início do período.'
    },
    indiceSatisfacao: {
      id: 'indiceSatisfacao',
      title: 'Índice de Satisfação',
      description: 'Avaliação dos atendimentos pelos usuários',
      analysis: '78% dos usuários estão satisfeitos com os atendimentos, 15% neutros e apenas 7% insatisfeitos, demonstrando uma percepção positiva do serviço.'
    },
  };

  // Filter to only show visible graphs
  const visibleGraphs = graphOrder.filter(id => visibilityState[id as keyof typeof visibilityState]);

  return (
    <div className="rounded-lg bg-white p-3 border border-orange-100">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium text-orange-800 flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-orange-600" />
          Relatórios Gráficos
        </h3>
        <div className="flex items-center">
          <LayoutGrid className="h-4 w-4 text-orange-700 mr-1" />
          <span className="text-xs text-orange-700">{visibleGraphs.length} gráficos</span>
        </div>
      </div>
      
      <SortableContext items={visibleGraphs} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleGraphs.map((id) => {
            const graphData = graphsData[id as keyof typeof graphsData];
            const component = chartComponents[id as keyof typeof chartComponents];
            
            return (
              <SortableGraphCard
                key={id}
                id={id}
                title={graphData.title}
                description={graphData.description}
                isVisible={true}
                isLoading={isLoading}
                isEditMode={false}
                showAnalysis={analysisState[id as keyof typeof analysisState]}
                analysis={graphData.analysis}
                onToggleVisibility={() => toggleVisibility(id)}
                onToggleAnalysis={() => toggleAnalysis(id)}
              >
                {component}
              </SortableGraphCard>
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
};
