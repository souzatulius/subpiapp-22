
import React, { useMemo } from 'react';
import { PieChart } from '../../charts/PieChart';
import { LineChart } from '../../charts/LineChart';
import { BarChart } from '../../charts/BarChart';
import { AreaChart } from '../../charts/AreaChart';

import { useChartData } from './useChartData';
import { useChartConfigs } from './useChartConfigs';
import { ChartComponentsCollection } from './types';

export const useMainChartComponents = () => {
  const { 
    barChartData, 
    areaChartData, 
    lineChartData, 
    pieChartData, 
    timelineChartData, 
    impactChartData, 
    originChartData, 
    satisfactionChartData 
  } = useChartData();
  
  const { chartColors } = useChartConfigs();
  
  // Chart components
  const chartComponents = useMemo<ChartComponentsCollection>(() => ({
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
  }), [
    barChartData, 
    areaChartData, 
    lineChartData, 
    pieChartData, 
    timelineChartData, 
    impactChartData, 
    originChartData, 
    satisfactionChartData,
    chartColors
  ]);

  return { chartComponents };
};
