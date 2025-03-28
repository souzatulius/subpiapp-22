
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

interface RelatoriosContentProps {
  filterDialogOpen?: boolean;
  setFilterDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RelatoriosContent: React.FC<RelatoriosContentProps> = () => {
  // Sample state - in a real app, this would come from a hook or context
  const [dateRange] = React.useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  
  // Simulating loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  
  // Sample chart data
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
  
  // Calcular valores totais para exibição nos cards
  const totalTemasPrincipais = barChartData.slice(0, 2).reduce((sum, item) => sum + item.Quantidade, 0);
  const mediaComplexidade = areaChartData.reduce((sum, item) => sum + item.Notas, 0) / areaChartData.length;
  const tempoMedio = lineChartData.reduce((sum, item) => sum + item.Demandas, 0) / lineChartData.length;
  const totalNotas = pieChartData.reduce((sum, item) => sum + item.value, 0);

  // Chart components
  const chartComponents = useMemo(() => ({
    'distribuicaoPorTemas': (
      <BarChart 
        data={barChartData}
        title="Distribuição por Temas"
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: '#f97316' }
        ]}
      />
    ),
    'complexidadePorTema': (
      <AreaChart 
        data={areaChartData}
        title="Complexidade por Tema"
        xAxisDataKey="name"
        areas={[
          { dataKey: 'Notas', name: 'Notas', color: '#f97316' }
        ]}
      />
    ),
    'tempoMedioResposta': (
      <LineChart 
        data={lineChartData}
        title="Tempo Médio de Resposta"
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Demandas', name: 'Tempo (dias)', color: '#f97316' }
        ]}
      />
    ),
    'performanceArea': (
      <BarChart 
        data={barChartData}
        title="Performance por Área"
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Eficiência', color: '#f97316' }
        ]}
      />
    ),
    'notasEmitidas': (
      <AreaChart 
        data={areaChartData}
        title="Notas Emitidas"
        xAxisDataKey="name"
        areas={[
          { dataKey: 'Notas', name: 'Quantidade', color: '#f97316' }
        ]}
      />
    ),
    'notasPorTema': (
      <PieChart 
        data={pieChartData}
        title="Notas por Tema"
        insight="Distribuição de notas por tema"
        colors={['#fdba74', '#fb923c', '#f97316', '#ea580c']}
      />
    ),
    'evolucaoMensal': (
      <LineChart 
        data={lineChartData}
        title="Evolução Mensal"
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Demandas', name: 'Demandas', color: '#f97316' }
        ]}
      />
    ),
    'comparativoAnual': (
      <BarChart 
        data={barChartData}
        title="Comparativo Anual"
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: '#f97316' }
        ]}
      />
    ),
  }), []);

  // Chart data metadata
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
  };

  // Create initial items
  const initialItems = useMemo(() => createRelatorioItems({
    chartData,
    chartComponents,
    isLoading,
    hiddenItems: [],
    expandedAnalyses: [],
    analysisOnlyItems: []
  }), [chartComponents, chartData, isLoading]);

  // Use the items state hook
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

  // Simula carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Organizando os itens em seções
  const temasTecnicosItems = items.filter(item => ['distribuicaoPorTemas', 'complexidadePorTema'].includes(item.id));
  const tempoDesempenhoItems = items.filter(item => ['tempoMedioResposta', 'performanceArea'].includes(item.id));
  const notasOficiaisItems = items.filter(item => ['notasEmitidas', 'notasPorTema'].includes(item.id));
  const tendenciasItems = items.filter(item => ['evolucaoMensal', 'comparativoAnual'].includes(item.id));

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
        {/* Temas Técnicos */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-800">Temas Técnicos</h2>
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
        
        {/* Tempo e Desempenho */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-800">Tempo e Desempenho</h2>
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
        
        {/* Notas Oficiais */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-800">Notas Oficiais</h2>
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
        
        {/* Tendências */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-800">Tendências</h2>
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
      </motion.div>
    </DndContext>
  );
};
