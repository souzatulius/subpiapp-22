
import { ChartData } from '../../types';

export const defaultChartData: ChartData[] = [
  {
    id: 'tempo-medio-resolucao',
    title: 'Tempo Médio de Resolução',
    description: 'Média de dias para resolução das ordens de serviço',
    type: 'indicator',
    data: { total: '0', details: [{ label: 'Média', value: '0' }, { label: 'Mediana', value: '0' }] },
    visible: true,
  },
  {
    id: 'ordens-por-distrito',
    title: 'Ordens de Serviço por Distrito',
    type: 'horizontalBar',
    data: { datasets: [] },
    visible: true,
  },
  {
    id: 'ordens-por-bairro',
    title: 'Ordens de Serviço por Bairro',
    type: 'bar',
    data: { labels: [], datasets: [] },
    visible: true,
  },
  {
    id: 'ordens-por-classificacao',
    title: 'Ordens de Serviço por Classificação',
    type: 'pie',
    data: { labels: [], datasets: [] },
    visible: true,
  },
  {
    id: 'ordens-por-status',
    title: 'Ordens de Serviço por Status',
    type: 'pie',
    data: { labels: [], datasets: [] },
    visible: true,
  },
  {
    id: 'ordens-criadas-por-mes',
    title: 'Ordens de Serviço Criadas por Mês',
    type: 'line',
    data: { labels: [], datasets: [] },
    visible: true,
  },
];
