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

  // Add ranking chart data with safe fallbacks
  const rankingData = useMemo(() => ({
    serviceDiversity: {
      labels: ['PAVIMENTAÇÃO', 'ÁREAS VERDES', 'ILUMINAÇÃO', 'ZELADORIA', 'LIMPEZA'],
      datasets: [
        {
          label: 'Tipos de serviço',
          data: [12, 8, 15, 10, 7],
          backgroundColor: '#a1a1aa',
        }
      ]
    },
    servicesByDistrict: {
      labels: ['ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI', 'PINHEIROS', 'PERDIZES'],
      datasets: [
        {
          label: 'Serviços',
          data: [18, 12, 15, 22, 14],
          backgroundColor: '#a1a1aa',
        }
      ]
    },
    serviceTypes: {
      labels: ['TAPA-BURACO', 'PODA DE ÁRVORE', 'LIMPEZA', 'MANUTENÇÃO', 'INSTALAÇÃO'],
      datasets: [
        {
          label: 'Quantidade',
          data: [35, 28, 22, 18, 12],
          backgroundColor: '#a1a1aa',
        }
      ]
    },
    statusDistribution: {
      labels: ['ABERTO', 'EM ANDAMENTO', 'CONCLUÍDO', 'CANCELADO'],
      datasets: [
        {
          label: 'Quantidade',
          data: [45, 30, 65, 12],
          backgroundColor: '#a1a1aa',
        }
      ]
    },
    statusTransition: {
      labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
      datasets: [
        {
          label: 'Aberto',
          data: [45, 39, 28, 35, 42, 38],
          backgroundColor: '#f97316',
        },
        {
          label: 'Em andamento',
          data: [30, 38, 42, 32, 28, 35],
          backgroundColor: '#fb923c',
        },
        {
          label: 'Concluído',
          data: [25, 32, 38, 42, 48, 55],
          backgroundColor: '#fdba74',
        }
      ]
    },
    timeComparison: {
      labels: ['Média Geral', 'Tapa-buraco', 'Poda de Árvore', 'Limpeza'],
      datasets: [
        {
          label: 'Dias',
          data: [18, 12, 25, 14],
          backgroundColor: '#a1a1aa',
        }
      ]
    },
    topCompanies: {
      labels: ['Empresa A', 'Empresa B', 'Empresa C', 'Empresa D', 'Empresa E'],
      datasets: [
        {
          label: 'Ordens Concluídas',
          data: [48, 42, 38, 32, 28],
          backgroundColor: '#a1a1aa',
        }
      ]
    }
  }), []);
  
  // Add additional metadata for ranking charts
  const rankingChartData = useMemo(() => ({
    'statusDistribution': {
      title: 'Status das ordens de serviço',
      value: 'Comparação',
      analysis: "A distribuição de status mostra que 42% das ordens estão concluídas, 29% estão abertas, 20% em andamento e 9% foram canceladas. A taxa de conclusão está dentro das metas estabelecidas, mas o número de ordens canceladas merece atenção especial."
    },
    'serviceTypes': {
      title: 'Serviços mais solicitados',
      value: 'Comparação',
      analysis: "Tapa-buraco representa 30% das solicitações, seguido por poda de árvore (24%). A predominância de serviços relacionados à pavimentação indica necessidade de planos preventivos mais eficazes para esta área."
    },
    'timeComparison': {
      title: 'Comparativo de tempo médio',
      value: '18 dias',
      analysis: "O tempo médio geral para conclusão de serviços é de 18 dias. O serviço de poda de árvore tem o maior tempo (25 dias), enquanto tapa-buraco apresenta o melhor desempenho (12 dias). Sugerimos revisão dos processos para reduzir o tempo de poda."
    },
    'topCompanies': {
      title: 'Empresas com mais ordens concluídas',
      value: 'Total: 188',
      analysis: "A Empresa A lidera com 26% das ordens concluídas, seguida pela Empresa B com 22%. As cinco principais empresas são responsáveis por 80% de todas as conclusões, demonstrando boa distribuição entre os principais prestadores."
    },
    'serviceDiversity': {
      title: 'Diversidade de serviços por departamento',
      value: 'Total: 52',
      analysis: "O departamento de iluminação apresenta a maior diversidade de tipos de serviço (15), seguido por pavimentação (12). Áreas verdes, apesar de alto volume, tem menor diversidade de tipos de serviço (8), indicando processos mais padronizados."
    },
    'servicesByDistrict': {
      title: 'Serviços por distrito',
      value: 'Diversidade',
      analysis: "Pinheiros é o distrito com maior número de serviços solicitados (22), seguido por Alto de Pinheiros (18). O volume e diversidade de serviços mostram correlação com a densidade populacional e idade da infraestrutura urbana em cada distrito."
    },
    'statusTransition': {
      title: 'Transição de status ao longo dos dias',
      value: 'Evolução temporal',
      analysis: "A evolução temporal mostra redução consistente de ordens abertas e aumento de concluídas ao longo do semestre. O mês de junho apresentou o melhor desempenho, com 55 conclusões e apenas 38 aberturas, indicando maior eficiência operacional."
    },
  }), []);

  return { 
    chartData, 
    rankingChartData, 
    rankingData 
  };
};
