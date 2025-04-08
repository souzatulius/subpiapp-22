import React, { useState, useEffect } from 'react';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { AlertCircle, BarChart3, PieChart, LineChart, TrendingUp, Clock, Users, MessageSquare, ThumbsUp } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { supabase } from '@/integrations/supabase/client';
import { BarChart } from './charts/BarChart';
import { LineChart as LineChartComponent } from './charts/LineChart';
import { PieChart as PieChartComponent } from './charts/PieChart';
import { AreaChart } from './charts/AreaChart';
import { useChartConfigs } from './hooks/charts/useChartConfigs';
import SortableGraphCard from './components/SortableGraphCard';

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
  chartVisibility?: Record<string, boolean>;
}

export const RelatoriosGraphCards: React.FC<RelatoriosGraphCardsProps> = ({ 
  isEditMode = false,
  chartVisibility
}) => {
  const { chartColors } = useChartConfigs();
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({
    problemas: [],
    origens: [],
    responseTimes: [],
    coordinations: [],
    mediaTypes: [],
    noticiasVsReleases: []
  });
  
  const [visibleCards, setVisibleCards] = useLocalStorage<string[]>('relatorios-graph-visible', [
    'distribuicaoPorTemas', 'origemDemandas', 'tempoMedioResposta', 'performanceArea',
    'notasEmitidas', 'noticiasVsReleases', 'problemasComuns'
  ]);
  
  const [cardsOrder, setCardsOrder] = useLocalStorage<string[]>('relatorios-graph-order', [
    'distribuicaoPorTemas', 'origemDemandas', 'tempoMedioResposta', 'performanceArea',
    'notasEmitidas', 'noticiasVsReleases', 'problemasComuns'
  ]);
  
  const [analysisCards, setAnalysisCards] = useLocalStorage<string[]>('relatorios-graph-analysis', []);

  useEffect(() => {
    if (chartVisibility) {
      const newVisibleCards = cardsOrder.filter(cardId => chartVisibility[cardId]);
      setVisibleCards(newVisibleCards);
    }
  }, [chartVisibility, cardsOrder, setVisibleCards]);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const { data: problemasData, error: problemasError } = await supabase
          .from('problemas')
          .select('id, descricao')
          .limit(5);

        if (problemasError) throw problemasError;

        const { data: origensData, error: origensError } = await supabase
          .from('origens_demandas')
          .select('id, descricao')
          .limit(5);

        if (origensError) throw origensError;

        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .limit(5);

        if (coordenacoesError) throw coordenacoesError;

        const problemasChart = problemasData.map(problem => ({
          name: problem.descricao,
          Quantidade: Math.floor(Math.random() * 50) + 10
        }));

        const origensChart = origensData.map(origem => ({
          name: origem.descricao,
          value: Math.floor(Math.random() * 50) + 10
        }));

        const coordenacoesChart = coordenacoesData.map(coord => ({
          name: coord.sigla || coord.descricao.substring(0, 3).toUpperCase(),
          fullName: coord.descricao,
          Quantidade: Math.floor(Math.random() * 100) + 50
        }));

        const responseTimesChart = [
          { name: 'Seg', Demandas: 48, Aprovacao: 72 },
          { name: 'Ter', Demandas: 42, Aprovacao: 65 },
          { name: 'Qua', Demandas: 36, Aprovacao: 58 },
          { name: 'Qui', Demandas: 30, Aprovacao: 52 },
          { name: 'Sex', Demandas: 24, Aprovacao: 45 },
        ];

        const mediaTypesChart = [
          { name: 'Jan', Quantidade: 10, Meta: 12 },
          { name: 'Fev', Quantidade: 15, Meta: 12 },
          { name: 'Mar', Quantidade: 12, Meta: 12 },
          { name: 'Abr', Quantidade: 18, Meta: 15 },
          { name: 'Mai', Quantidade: 22, Meta: 15 },
          { name: 'Jun', Quantidade: 20, Meta: 18 },
        ];

        const noticiasVsReleasesChart = [
          { name: 'Jan', Noticias: 34, Releases: 18 },
          { name: 'Fev', Noticias: 42, Releases: 22 },
          { name: 'Mar', Noticias: 38, Releases: 24 },
          { name: 'Abr', Noticias: 45, Releases: 26 },
          { name: 'Mai', Noticias: 52, Releases: 30 },
          { name: 'Jun', Noticias: 48, Releases: 28 },
        ];

        setChartData({
          problemas: problemasChart,
          origens: origensChart,
          responseTimes: responseTimesChart,
          coordinations: coordenacoesChart,
          mediaTypes: mediaTypesChart,
          noticiasVsReleases: noticiasVsReleasesChart
        });

        console.log('Chart data loaded successfully:', { problemasChart, origensChart, coordenacoesChart });
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData({
          problemas: mockBarData,
          origens: mockPieData,
          responseTimes: mockLineData,
          coordinations: mockAreasData,
          mediaTypes: mockAreaData,
          noticiasVsReleases: mockNoticiasVsReleasesData
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const cardsData: Record<string, GraphCardItem> = {
    distribuicaoPorTemas: {
      id: 'distribuicaoPorTemas',
      title: 'Problemas mais frequentes',
      description: 'Temas das solicitações no mês atual',
      visible: chartVisibility?.distribuicaoPorTemas !== false,
      showAnalysis: analysisCards.includes('distribuicaoPorTemas'),
      analysis: 'Os temas com maior volume de demandas são Serviços Urbanos e Meio Ambiente. Houve um aumento de 15% nas demandas de Serviços Urbanos em comparação com o mês anterior.'
    },
    origemDemandas: {
      id: 'origemDemandas',
      title: 'Origem das Demandas',
      description: 'De onde vêm as solicitações',
      visible: chartVisibility?.origemDemandas !== false,
      showAnalysis: analysisCards.includes('origemDemandas'),
      analysis: 'A maioria das demandas vem diretamente das coordenações (45%), seguidas de imprensa (35%) e redes sociais (12%). As origens internas representam 8% do total de demandas recebidas.'
    },
    tempoMedioResposta: {
      id: 'tempoMedioResposta',
      title: 'Tempo Médio de Resposta',
      description: 'Evolução de agilidade de retorno para a imprensa',
      visible: chartVisibility?.tempoMedioResposta !== false,
      showAnalysis: analysisCards.includes('tempoMedioResposta'),
      analysis: 'O tempo médio de resposta tem diminuído nos últimos meses, indicando melhoria na eficiência dos processos internos. O pico às terças-feiras deve-se ao volume maior de demandas recebidas às segundas.'
    },
    performanceArea: {
      id: 'performanceArea',
      title: 'Áreas mais acionadas',
      description: 'Coordenações mais envolvidas nas solicitações',
      visible: chartVisibility?.performanceArea !== false,
      showAnalysis: analysisCards.includes('performanceArea'),
      analysis: 'As áreas de Comunicação e Planejamento têm os melhores índices de resposta. A CPO recebe o maior volume de demandas, seguida pela CPDU, refletindo o foco atual em projetos de infraestrutura.'
    },
    notasEmitidas: {
      id: 'notasEmitidas',
      title: 'Notas de Imprensa',
      description: 'Evolução de posicionamentos no mês',
      visible: chartVisibility?.notasEmitidas !== false,
      showAnalysis: analysisCards.includes('notasEmitidas'),
      analysis: 'Houve um aumento de 15% na emissão de notas oficiais no último trimestre, com picos nos meses de abril e maio devido a eventos especiais e campanhas sazonais.'
    },
    problemasComuns: {
      id: 'problemasComuns',
      title: 'Problemas mais comuns',
      description: 'Categorias de problemas na última semana',
      visible: chartVisibility?.problemasComuns !== false,
      showAnalysis: analysisCards.includes('problemasComuns'),
      analysis: 'As categorias "Limpeza Urbana" e "Iluminação Pública" representam mais de 50% dos problemas reportados. Problemas com áreas verdes aumentaram 12% no último mês, possivelmente devido à estação de chuvas.'
    },
    noticiasVsReleases: {
      id: 'noticiasVsReleases',
      title: 'Notícias vs. Releases',
      description: 'Comparação entre notícias e releases oficiais',
      visible: chartVisibility?.noticiasVsReleases !== false,
      showAnalysis: analysisCards.includes('noticiasVsReleases'),
      analysis: 'Observa-se uma correlação direta entre o número de releases emitidos e o aumento de notícias sobre os temas, com uma taxa de conversão média de 1:1.7 (cada release gera aproximadamente 1.7 notícias relacionadas).'
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
    { name: 'Secom', value: 12 },
    { name: 'Internas', value: 8 },
  ];

  const mockProblemasData = [
    { name: 'Limpeza Urbana', value: 42 },
    { name: 'Iluminação Pública', value: 28 },
    { name: 'Vias Públicas', value: 18 },
    { name: 'Áreas Verdes', value: 12 },
    { name: 'Outros', value: 10 },
  ];

  const mockAreasData = [
    { name: 'CPO', fullName: 'Coordenadoria de Planejamento e Obras', Quantidade: 92 },
    { name: 'CPDU', fullName: 'Coordenadoria de Projetos e Desenvolvimento Urbano', Quantidade: 87 },
    { name: 'GOV', fullName: 'Governo Local', Quantidade: 82 },
    { name: 'JUR', fullName: 'Assessoria Jurídica', Quantidade: 75 },
    { name: 'FIN', fullName: 'Finanças', Quantidade: 68 },
  ];

  const mockAreaData = [
    { name: 'Jan', Quantidade: 10, Meta: 12 },
    { name: 'Fev', Quantidade: 15, Meta: 12 },
    { name: 'Mar', Quantidade: 12, Meta: 12 },
    { name: 'Abr', Quantidade: 18, Meta: 15 },
    { name: 'Mai', Quantidade: 22, Meta: 15 },
    { name: 'Jun', Quantidade: 20, Meta: 18 },
  ];

  const mockNoticiasVsReleasesData = [
    { name: 'Jan', Noticias: 34, Releases: 18 },
    { name: 'Fev', Noticias: 42, Releases: 22 },
    { name: 'Mar', Noticias: 38, Releases: 24 },
    { name: 'Abr', Noticias: 45, Releases: 26 },
    { name: 'Mai', Noticias: 52, Releases: 30 },
    { name: 'Jun', Noticias: 48, Releases: 28 },
  ];

  const localChartComponents: Record<string, React.ReactNode> = {
    distribuicaoPorTemas: <BarChart data={chartData.problemas.length ? chartData.problemas : mockBarData} xAxisDataKey="name" bars={[{ dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }]} />,
    origemDemandas: <PieChartComponent data={chartData.origens.length ? chartData.origens : mockPieData} colorSet="default" showOnlyPercentage={false} showLabels={true} legendPosition="bottom" />,
    tempoMedioResposta: <LineChartComponent data={chartData.responseTimes.length ? chartData.responseTimes : mockLineData} xAxisDataKey="name" yAxisTicks={[10, 20, 50, 60, 90]} lines={[{ dataKey: 'Demandas', name: 'Respostas da coordenação', color: chartColors[0] }, { dataKey: 'Aprovacao', name: 'Aprovação da nota', color: chartColors[1] }]} />,
    performanceArea: <BarChart data={chartData.coordinations.length ? chartData.coordinations : mockAreasData} xAxisDataKey="name" bars={[{ dataKey: 'Quantidade', name: 'Demandas no mês', color: chartColors[1] }]} tooltipFormatter={(value, name, item) => [value, item.payload.fullName || name]} />,
    notasEmitidas: <LineChartComponent data={chartData.mediaTypes.length ? chartData.mediaTypes : mockAreaData} xAxisDataKey="name" lines={[{ dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }]} />,
    problemasComuns: <PieChartComponent data={mockProblemasData} colorSet="orange" showOnlyPercentage={false} showLabels={true} legendPosition="bottom" />,
    noticiasVsReleases: <BarChart 
      data={chartData.noticiasVsReleases.length ? chartData.noticiasVsReleases : mockNoticiasVsReleasesData} 
      xAxisDataKey="name" 
      bars={[
        { dataKey: 'Noticias', name: 'Notícias', color: chartColors[0] },
        { dataKey: 'Releases', name: 'Releases', color: chartColors[1] }
      ]} 
    />,
  };

  const cardIcons: Record<string, React.ReactNode> = {
    distribuicaoPorTemas: <BarChart3 className="h-5 w-5 text-gray-500" />,
    origemDemandas: <PieChart className="h-5 w-5 text-gray-500" />,
    tempoMedioResposta: <Clock className="h-5 w-5 text-gray-500" />,
    performanceArea: <TrendingUp className="h-5 w-5 text-gray-500" />,
    notasEmitidas: <LineChart className="h-5 w-5 text-gray-500" />,
    notasPorTema: <MessageSquare className="h-5 w-5 text-gray-500" />,
    evolucaoMensal: <TrendingUp className="h-5 w-5 text-gray-500" />,
    indiceSatisfacao: <ThumbsUp className="h-5 w-5 text-gray-500" />,
    problemasComuns: <PieChart className="h-5 w-5 text-gray-500" />,
    noticiasVsReleases: <BarChart3 className="h-5 w-5 text-gray-500" />,
  };

  const renderEmptyDataMessage = (cardId: string) => (
    <div className="h-[250px] flex flex-col items-center justify-center text-slate-400 p-4 text-center">
      <AlertCircle className="h-10 w-10 mb-3 text-gray-300" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardsOrder
            .filter(cardId => {
              return visibleCards.includes(cardId) && 
                    (chartVisibility ? chartVisibility[cardId] !== false : true);
            })
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
                  onToggleVisibility={() => handleToggleVisibility(card.id)}
                  onToggleAnalysis={() => handleToggleAnalysis(card.id)}
                  hideMenuIcon={!isEditMode}
                >
                  {isLoading ? (
                    <div className="h-[220px] flex items-center justify-center">
                      <div className="h-8 w-8 border-4 border-t-gray-500 border-r-transparent border-b-gray-300 border-l-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : localChartComponents[cardId] ? (
                    <div className="h-[220px] p-2">
                      {localChartComponents[cardId]}
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
