import React, { useMemo } from 'react';
import { BarChart } from '../../charts/BarChart';
import { LineChart } from '../../charts/LineChart';
import { PieChart } from '../../charts/PieChart';
import { AreaChart } from '../../charts/AreaChart';
import { useReportsData } from '../useReportsData';
import { useChartConfigs } from './useChartConfigs';
import { 
  transformDistrictsToPieData,
  transformMediaTypesToBarData, 
  transformOriginsToBarData,
  transformResponseTimesToLineData,
  transformProblemasToBarData,
  transformCoordinationsToBarData,
  transformStatusToPieData,
  transformApprovalsToPieData,
  transformResponsiblesToBarData,
  transformNeighborhoodsToBarData
} from '../../utils/chartDataTransformers';
import { ChartComponentsCollection } from './types';

export const useMainChartComponents = () => {
  const { reportsData, isLoading } = useReportsData();
  const { chartColors, pieChartColors } = useChartConfigs();

  // Process and transform real data for charts
  const chartComponents = useMemo<ChartComponentsCollection>(() => {
    // Show empty charts if data is loading or not available
    if (isLoading || !reportsData) {
      return {
        'distribuicaoPorTemas': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
            ]}
          />
        ),
        'complexidadePorTema': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Complexidade', name: 'Complexidade', color: chartColors[0] }
            ]}
          />
        ),
        'origemDemandas': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Solicitações', name: 'Solicitações', color: chartColors[0] }
            ]}
          />
        ),
        'tempoMedioResposta': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Demandas', name: 'Dias até resposta', color: chartColors[0] }
            ]}
          />
        ),
        'performanceArea': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Respostas', name: 'Quantidade', color: chartColors[1] }
            ]}
          />
        ),
        'timelineRespostas': (
          <AreaChart 
            data={[]}
            xAxisDataKey="name"
            areas={[
              { dataKey: 'Respostas', name: 'Respostas', color: chartColors[0] }
            ]}
          />
        ),
        'notasEmitidas': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[1] }
            ]}
          />
        ),
        'notasPorTema': (
          <PieChart 
            data={[]}
            colorSet="blue"
          />
        ),
        'distribuicaoImpacto': (
          <PieChart 
            data={[]}
            colorSet="orange"
          />
        ),
        'evolucaoMensal': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Demandas', name: 'Demandas', color: chartColors[0] },
              { dataKey: 'Notas', name: 'Notas', color: chartColors[1] }
            ]}
          />
        ),
        'comparativoAnual': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Atual', name: 'Atual', color: chartColors[0] },
              { dataKey: 'Anterior', name: 'Anterior', color: chartColors[1] }
            ]}
          />
        ),
        'indiceSatisfacao': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Satisfação', name: 'Índice', color: chartColors[0] }
            ]}
          />
        ),
      };
    }

    // Transform real data for charts
    const pieDistrictsData = transformDistrictsToPieData(reportsData.districts);
    const barOriginsData = transformOriginsToBarData(reportsData.origins);
    const lineResponseTimesData = transformResponseTimesToLineData(reportsData.responseTimes);
    const barProblemasData = transformProblemasToBarData(reportsData.problemas);
    const barCoordinationsData = transformCoordinationsToBarData(reportsData.coordinations);
    const pieStatusData = transformStatusToPieData(reportsData.statuses);
    const pieApprovalsData = transformApprovalsToPieData(reportsData.approvals);
    const barResponsiblesData = transformResponsiblesToBarData(reportsData.responsibles);
    const barMediaTypesData = transformMediaTypesToBarData(reportsData.mediaTypes);
    const barNeighborhoodsData = transformNeighborhoodsToBarData(reportsData.neighborhoods);
    
    return {
      'distribuicaoPorTemas': (
        <BarChart 
          data={barProblemasData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
          ]}
        />
      ),
      'complexidadePorTema': (
        <BarChart 
          data={barNeighborhoodsData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[1] }
          ]}
        />
      ),
      'origemDemandas': (
        <BarChart 
          data={barOriginsData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Solicitações', name: 'Quantidade', color: chartColors[0] }
          ]}
        />
      ),
      'tempoMedioResposta': (
        <LineChart 
          data={lineResponseTimesData}
          xAxisDataKey="name"
          lines={[
            { dataKey: 'Demandas', name: 'Dias até resposta', color: chartColors[0] }
          ]}
        />
      ),
      'performanceArea': (
        <BarChart 
          data={barCoordinationsData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Respostas', name: 'Quantidade', color: chartColors[1] }
          ]}
        />
      ),
      'timelineRespostas': (
        <BarChart 
          data={barResponsiblesData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Demandas criadas', color: chartColors[2] }
          ]}
        />
      ),
      'notasEmitidas': (
        <BarChart 
          data={barMediaTypesData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[1] }
          ]}
        />
      ),
      'notasPorTema': (
        <PieChart 
          data={pieStatusData}
          colorSet="blue"
        />
      ),
      'distribuicaoImpacto': (
        <PieChart 
          data={pieDistrictsData}
          colorSet="orange"
        />
      ),
      'evolucaoMensal': (
        <LineChart 
          data={lineResponseTimesData}
          xAxisDataKey="name"
          lines={[
            { dataKey: 'Demandas', name: 'Tempo médio (dias)', color: chartColors[0] }
          ]}
        />
      ),
      'comparativoAnual': (
        <BarChart 
          data={barMediaTypesData.slice(0, 3)}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[1] }
          ]}
        />
      ),
      'indiceSatisfacao': (
        <PieChart 
          data={pieApprovalsData}
          colorSet="status"
        />
      ),
    };
  }, [reportsData, isLoading, chartColors, pieChartColors]);

  return { chartComponents };
};
