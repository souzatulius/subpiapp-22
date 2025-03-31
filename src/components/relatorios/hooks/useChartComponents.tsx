import React, { useMemo } from 'react';
import { PieChart } from '../charts/PieChart';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { AreaChart } from '../charts/AreaChart';

export interface ChartData {
  name: string;
  value?: number;
  Demandas?: number;
  Quantidade?: number;
  Notas?: number;
  Respostas?: number;
  Solicitações?: number;
  Satisfação?: number;
}

export const useChartComponents = () => {
  // New color palette
  const chartColors = ['#f97316', '#0ea5e9', '#1e40af', '#71717a', '#27272a'];
  
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

  // New chart data for additional charts
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

  // Chart components
  const chartComponents = useMemo(() => ({
    'distribuicaoPorTemas': (
      <BarChart 
        data={barChartData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'complexidadePorTema': (
      <AreaChart 
        data={areaChartData}
        xAxisDataKey="name"
        areas={[
          { dataKey: 'Notas', name: 'Notas', color: chartColors[1] }
        ]}
      />
    ),
    'tempoMedioResposta': (
      <LineChart 
        data={lineChartData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Demandas', name: 'Tempo (dias)', color: chartColors[0] }
        ]}
      />
    ),
    'performanceArea': (
      <BarChart 
        data={barChartData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Eficiência', color: chartColors[1] }
        ]}
      />
    ),
    'notasEmitidas': (
      <AreaChart 
        data={areaChartData}
        xAxisDataKey="name"
        areas={[
          { dataKey: 'Notas', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'notasPorTema': (
      <PieChart 
        data={pieChartData}
        colors={chartColors}
      />
    ),
    'evolucaoMensal': (
      <LineChart 
        data={lineChartData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Demandas', name: 'Demandas', color: chartColors[1] }
        ]}
      />
    ),
    'comparativoAnual': (
      <BarChart 
        data={barChartData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    // New chart components
    'timelineRespostas': (
      <LineChart 
        data={timelineChartData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Respostas', name: 'Respostas', color: chartColors[2] }
        ]}
      />
    ),
    'distribuicaoImpacto': (
      <PieChart 
        data={impactChartData}
        colors={chartColors}
      />
    ),
    'origemDemandas': (
      <BarChart 
        data={originChartData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Solicitações', name: 'Solicitações', color: chartColors[1] }
        ]}
      />
    ),
    'indiceSatisfacao': (
      <LineChart 
        data={satisfactionChartData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Satisfação', name: 'Índice', color: chartColors[0] }
        ]}
      />
    ),
  }), []);

  // Add ranking chart data
  const serviceDiversityData = [
    { name: 'PAVIMENTAÇÃO', Quantidade: 12 },
    { name: 'ÁREAS VERDES', Quantidade: 8 },
    { name: 'ILUMINAÇÃO', Quantidade: 15 },
    { name: 'ZELADORIA', Quantidade: 10 },
    { name: 'LIMPEZA', Quantidade: 7 },
  ];
  
  const servicesByDistrictData = [
    { name: 'ALTO DE PINHEIROS', Quantidade: 18 },
    { name: 'JARDIM PAULISTA', Quantidade: 12 },
    { name: 'ITAIM BIBI', Quantidade: 15 },
    { name: 'PINHEIROS', Quantidade: 22 },
    { name: 'PERDIZES', Quantidade: 14 },
  ];
  
  const serviceTypesData = [
    { name: 'TAPA-BURACO', Quantidade: 35 },
    { name: 'PODA DE ÁRVORE', Quantidade: 28 },
    { name: 'LIMPEZA', Quantidade: 22 },
    { name: 'MANUTENÇÃO', Quantidade: 18 },
    { name: 'INSTALAÇÃO', Quantidade: 12 },
  ];
  
  const statusDistributionData = [
    { name: 'ABERTO', Quantidade: 45 },
    { name: 'EM ANDAMENTO', Quantidade: 30 },
    { name: 'CONCLUÍDO', Quantidade: 65 },
    { name: 'CANCELADO', Quantidade: 12 },
  ];
  
  const timeComparisonData = [
    { name: 'Média Geral', Dias: 18 },
    { name: 'Tapa-buraco', Dias: 12 },
    { name: 'Poda de Árvore', Dias: 25 },
    { name: 'Limpeza', Dias: 14 },
  ];
  
  const topCompaniesData = [
    { name: 'Empresa A', Concluídas: 48 },
    { name: 'Empresa B', Concluídas: 42 },
    { name: 'Empresa C', Concluídas: 38 },
    { name: 'Empresa D', Concluídas: 32 },
    { name: 'Empresa E', Concluídas: 28 },
  ];
  
  const statusTransitionData = [
    { name: 'Janeiro', Aberto: 45, EmAndamento: 30, Concluído: 25 },
    { name: 'Fevereiro', Aberto: 39, EmAndamento: 38, Concluído: 32 },
    { name: 'Março', Aberto: 28, EmAndamento: 42, Concluído: 38 },
    { name: 'Abril', Aberto: 35, EmAndamento: 32, Concluído: 42 },
    { name: 'Maio', Aberto: 42, EmAndamento: 28, Concluído: 48 },
    { name: 'Junho', Aberto: 38, EmAndamento: 35, Concluído: 55 },
  ];

  // Add ranking chart components
  const rankingChartComponents = useMemo(() => ({
    'serviceDiversity': (
      <BarChart 
        data={serviceDiversityData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'servicesByDistrict': (
      <BarChart 
        data={servicesByDistrictData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'serviceTypes': (
      <BarChart 
        data={serviceTypesData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'statusDistribution': (
      <BarChart 
        data={statusDistributionData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'timeComparison': (
      <BarChart 
        data={timeComparisonData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Dias', name: 'Dias', color: chartColors[0] }
        ]}
      />
    ),
    'topCompanies': (
      <BarChart 
        data={topCompaniesData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Concluídas', name: 'Concluídas', color: chartColors[0] }
        ]}
      />
    ),
    'statusTransition': (
      <LineChart 
        data={statusTransitionData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Aberto', name: 'Aberto', color: chartColors[2] },
          { dataKey: 'EmAndamento', name: 'Em Andamento', color: chartColors[1] },
          { dataKey: 'Concluído', name: 'Concluído', color: chartColors[0] }
        ]}
      />
    ),
  }), []);

  return {
    chartComponents,
    rankingChartComponents,
    pieChartData,
    lineChartData,
    barChartData,
    areaChartData,
    timelineChartData,
    impactChartData,
    originChartData,
    satisfactionChartData,
    serviceDiversityData,
    servicesByDistrictData,
    serviceTypesData,
    statusDistributionData,
    timeComparisonData,
    topCompaniesData,
    statusTransitionData
  };
};
