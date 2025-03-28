
import { useMemo } from 'react';
import { useChartComponents } from './useChartComponents';

export interface ChartMetadata {
  title: string;
  value: string;
  analysis: string;
}

export const useChartData = () => {
  const { 
    pieChartData, 
    lineChartData, 
    barChartData, 
    areaChartData, 
    timelineChartData, 
    impactChartData, 
    originChartData, 
    satisfactionChartData 
  } = useChartComponents();

  // Calculate values for display in cards
  const totalTemasPrincipais = useMemo(() => 
    barChartData.slice(0, 2).reduce((sum, item) => sum + item.Quantidade!, 0),
  [barChartData]);

  const mediaComplexidade = useMemo(() => 
    areaChartData.reduce((sum, item) => sum + item.Notas!, 0) / areaChartData.length,
  [areaChartData]);

  const tempoMedio = useMemo(() => 
    lineChartData.reduce((sum, item) => sum + item.Demandas!, 0) / lineChartData.length,
  [lineChartData]);

  const totalNotas = useMemo(() => 
    pieChartData.reduce((sum, item) => sum + item.value!, 0),
  [pieChartData]);

  const mediaSatisfacao = useMemo(() => 
    satisfactionChartData.reduce((sum, item) => sum + item.Satisfação!, 0) / satisfactionChartData.length,
  [satisfactionChartData]);

  const totalRespostas = useMemo(() => 
    timelineChartData.reduce((sum, item) => sum + item.Respostas!, 0),
  [timelineChartData]);

  const totalImpacto = useMemo(() => 
    impactChartData.reduce((sum, item) => sum + item.value!, 0),
  [impactChartData]);

  const totalOrigem = useMemo(() => 
    originChartData.reduce((sum, item) => sum + item.Solicitações!, 0),
  [originChartData]);
  
  // Chart data metadata
  const chartData = useMemo(() => ({
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
      value: `Total: ${areaChartData.reduce((sum, item) => sum + item.Notas!, 0)}`,
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
    // New charts data
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
  }), [
    totalTemasPrincipais, 
    mediaComplexidade, 
    tempoMedio,
    totalNotas,
    areaChartData,
    mediaSatisfacao,
    totalRespostas,
    totalImpacto,
    totalOrigem
  ]);

  return { chartData };
};
