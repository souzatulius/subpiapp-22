
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
    // New chart components
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

  return {
    chartComponents,
    pieChartData,
    lineChartData,
    barChartData,
    areaChartData,
    timelineChartData,
    impactChartData,
    originChartData,
    satisfactionChartData
  };
};
