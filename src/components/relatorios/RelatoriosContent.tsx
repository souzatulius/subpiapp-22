import React, { useState, useEffect, useMemo } from 'react';
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
  
  const pieChartData = [
    { name: 'Pendentes', value: 30 },
    { name: 'Em Andamento', value: 50 },
    { name: 'Concluídas', value: 100 },
    { name: 'Canceladas', value: 20 },
  ];
  
  const lineChartData = [
    { name: 'Jan', Demandas: 12 },
    { name: 'Fev', Demandas: 19 },
    { name: 'Mar', Demandas: 3 },
    { name: 'Abr', Demandas: 5 },
    { name: 'Mai', Demandas: 2 },
    { name: 'Jun', Demandas: 3 },
  ];
  
  const barChartData = [
    { name: 'Tema 1', Quantidade: 12 },
    { name: 'Tema 2', Quantidade: 19 },
    { name: 'Tema 3', Quantidade: 3 },
    { name: 'Tema 4', Quantidade: 5 },
    { name: 'Tema 5', Quantidade: 2 },
  ];
  
  const areaChartData = [
    { name: 'Jan', Notas: 12 },
    { name: 'Fev', Notas: 19 },
    { name: 'Mar', Notas: 3 },
    { name: 'Abr', Notas: 5 },
    { name: 'Mai', Notas: 2 },
    { name: 'Jun', Notas: 3 },
  ];

  const timelineChartData = [
    { name: 'Jan', Respostas: 8 },
    { name: 'Fev', Respostas: 12 },
    { name: 'Mar', Respostas: 15 },
    { name: 'Abr', Respostas: 10 },
    { name: 'Mai', Respostas: 16 },
    { name: 'Jun', Respostas: 18 },
  ];

  const impactChartData = [
    { name: 'Baixo', value: 45 },
    { name: 'Médio', value: 35 },
    { name: 'Alto', value: 20 },
  ];

  const originChartData = [
    { name: 'Imprensa', Solicitações: 25 },
    { name: 'Órgãos', Solicitações: 18 },
    { name: 'Cidadãos', Solicitações: 32 },
    { name: 'Interno', Solicitações: 15 },
  ];

  const satisfactionChartData = [
    { name: 'Jan', Satisfação: 7.5 },
    { name: 'Fev', Satisfação: 7.8 },
    { name: 'Mar', Satisfação: 8.2 },
    { name: 'Abr', Satisfação: 8.0 },
    { name: 'Mai', Satisfação: 8.5 },
    { name: 'Jun', Satisfação: 8.7 },
  ];
  
  const totalTemasPrincipais = barChartData.slice(0, 2).reduce((sum, item) => sum + item.Quantidade, 0);
  const mediaComplexidade = areaChartData.reduce((sum, item) => sum + item.Notas, 0) / areaChartData.length;
  const tempoMedio = lineChartData.reduce((sum, item) => sum + item.Demandas, 0) / lineChartData.length;
  const totalNotas = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const mediaSatisfacao = satisfactionChartData.reduce((sum, item) => sum + item.Satisfação, 0) / satisfactionChartData.length;
  const totalRespostas = timelineChartData.reduce((sum, item) => sum + item.Respostas, 0);
  const totalImpacto = impactChartData.reduce((sum, item) => sum + item.value, 0);
  const totalOrigem = originChartData.reduce((sum, item) => sum + item.Solicitações, 0);

  const chartComponents = useMemo(() => ({
    'distribuicaoPorTemas': (
      <BarChart 
        data={barChartData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: '#a1a1aa' }
        ]}
      />
    ),
    'complexidadePorTema': (
      <AreaChart 
        data={areaChartData}
        xAxisDataKey="name"
        areas={[
          { dataKey: 'Notas', name: 'Notas', color: '#a1a1aa' }
        ]}
      />
    ),
    'tempoMedioResposta': (
      <LineChart 
        data={lineChartData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Demandas', name: 'Tempo (dias)', color: '#a1a1aa' }
        ]}
      />
    ),
    'performanceArea': (
      <BarChart 
        data={barChartData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Eficiência', color: '#a1a1aa' }
        ]}
      />
    ),
    'notasEmitidas': (
      <AreaChart 
        data={areaChartData}
        xAxisDataKey="name"
        areas={[
          { dataKey: 'Notas', name: 'Quantidade', color: '#a1a1aa' }
        ]}
      />
    ),
    'notasPorTema': (
      <PieChart 
        data={pieChartData}
        colors={['#d4d4d8', '#a1a1aa', '#71717a', '#52525b']}
      />
    ),
    'evolucaoMensal': (
      <LineChart 
        data={lineChartData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Demandas', name: 'Demandas', color: '#a1a1aa' }
        ]}
      />
    ),
    'comparativoAnual': (
      <BarChart 
        data={barChartData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: '#a1a1aa' }
        ]}
      />
    ),
    'timelineRespostas': (
      <LineChart 
        data={timelineChartData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Respostas', name: 'Respostas', color: '#a1a1aa' }
        ]}
      />
    ),
    'distribuicaoImpacto': (
      <PieChart 
        data={impactChartData}
        colors={['#d4d4d8', '#a1a1aa', '#71717a', '#52525b']}
      />
    ),
    'origemDemandas': (
      <BarChart 
        data={originChartData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Solicitações', name: 'Solicitações', color: '#a1a1aa' }
        ]}
      />
    ),
    'indiceSatisfacao': (
      <LineChart 
        data={satisfactionChartData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Satisfação', name: 'Índice', color: '#a1a1aa' }
        ]}
      />
    ),
  }), []);

  const chartData = {
    'distribuicaoPorTemas': {
      title: 'Distribuição por Temas',
      value: `Total: ${totalTemasPrincipais}`,
      analysis: "A análise mostra que o Tema 2 tem a maior concentração de demandas (46%), seguido pelo Tema 1 (29%). Os Temas 3, 4 e 5 representam juntos apenas 25% do total, indicando uma concentração significativa nos dois temas principais. Recomenda-se alocar recursos proporcionalmente a esta distribuição."
    },
    'complexidadePorTema': {
      title: 'Complexidade por Tema',
      value: `Média: ${mediaComplexidade.toFixed(1)}`,
      analysis: "Os dados de complexidade mostram uma tendência sazonal, com picos em fevereiro e queda significativa em março. A complexidade média é de 7,3 pontos, com desvio padrão de 6,4, indicando grande variabilidade. É recomendável investigar os fatores que causaram o pico de fevereiro para melhor planejamento futuro."
    },
    'tempoMedioResposta': {
      title: 'Tempo Médio de Resposta',
      value: `${tempoMedio.toFixed(1)} dias`,
      analysis: "O tempo médio de resposta mostra uma tendência de melhora constante desde janeiro, com exceção de março que apresentou um pequeno aumento. A média anual é de 7,3 dias, o que está dentro da meta estabelecida de 10 dias. Destaque para junho, que apresentou o menor tempo médio do semestre (3 dias)."
    },
    'performanceArea': {
      title: 'Performance por Área',
      value: "Análise Comparativa",
      analysis: "A análise de performance por área demonstra que as áreas 1 e 2 são responsáveis por 75% de toda a eficiência operacional. A área 3 apresenta o maior potencial de melhoria, com apenas 7% do índice de eficiência atual. Recomenda-se um plano específico de capacitação e otimização de processos para as áreas com menor desempenho."
    },
    'notasEmitidas': {
      title: 'Notas Emitidas',
      value: `Total: ${areaChartData.reduce((sum, item) => sum + item.Notas, 0)}`,
      analysis: "O volume de notas emitidas apresenta uma sazonalidade clara, com picos nos meses de janeiro e fevereiro e queda acentuada no segundo trimestre. O total de 44 notas no semestre representa uma média de 7,3 notas mensais. Comparado ao mesmo período do ano anterior, houve uma redução de 12% no volume total."
    },
    'notasPorTema': {
      title: 'Notas por Tema',
      value: `Total: ${totalNotas}`,
      analysis: "A distribuição de notas por tema mostra uma predominância clara de notas concluídas (50%), seguidas pelas em andamento (25%). Notas pendentes (15%) e canceladas (10%) somam 25% do total. Este perfil indica uma boa taxa de conclusão, mas sugere a necessidade de melhorias no processo para reduzir o percentual de notas canceladas."
    },
    'evolucaoMensal': {
      title: 'Evolução Mensal',
      value: "Análise Temporal",
      analysis: "A evolução mensal das demandas mostra uma tendência de queda após o pico em fevereiro. A média móvel de 3 meses indica uma estabilização próxima a 3,3 demandas mensais no segundo trimestre. Projetando esta tendência, espera-se um aumento gradual no próximo trimestre, com pico estimado em outubro."
    },
    'comparativoAnual': {
      title: 'Comparativo Anual',
      value: "Crescimento: 23%",
      analysis: "O comparativo anual revela um crescimento de 23% em relação ao mesmo período do ano anterior. Os temas 1 e 2 apresentaram o maior crescimento relativo (35% e 42%, respectivamente), enquanto o tema 5 teve uma redução de 18%. Esta mudança na distribuição sugere uma alteração nas prioridades operacionais."
    },
    'timelineRespostas': {
      title: 'Timeline de Respostas',
      value: `Total: ${totalRespostas}`,
      analysis: "A timeline de respostas mostra uma tendência de crescimento constante ao longo do semestre, com uma leve queda em abril. O total de 79 respostas representa uma média de 13,2 respostas mensais. Comparado ao semestre anterior, houve um aumento de 18% no volume total de respostas processadas."
    },
    'distribuicaoImpacto': {
      title: 'Distribuição por Impacto',
      value: `Total: ${totalImpacto}`,
      analysis: "A distribuição por nível de impacto mostra que 45% das demandas têm impacto baixo, 35% têm impacto médio e 20% têm impacto alto. Esta distribuição é considerada saudável, mas deve-se monitorar o crescimento de demandas de alto impacto, que apresentaram aumento de 5% em comparação com o trimestre anterior."
    },
    'origemDemandas': {
      title: 'Origem das Demandas',
      value: `Total: ${totalOrigem}`,
      analysis: "As origens das demandas indicam que a maioria (36%) provém de cidadãos, seguido pela imprensa (28%), órgãos públicos (20%) e demandas internas (16%). A alta participação cidadã demonstra eficácia nos canais de comunicação direta com a população, mas requer atenção especial para gestão do volume crescente."
    },
    'indiceSatisfacao': {
      title: 'Índice de Satisfação',
      value: `Média: ${mediaSatisfacao.toFixed(1)}`,
      analysis: "O índice de satisfação apresenta crescimento constante ao longo do semestre, atingindo 8,7 em junho. A média de 8,1 pontos está acima da meta estabelecida de 7,5, indicando bom desempenho da equipe. A tendência positiva sugere que as melhorias implementadas no atendimento estão sendo bem recebidas."
    },
  };

  const initialItems = useMemo(() => createRelatorioItems({
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
