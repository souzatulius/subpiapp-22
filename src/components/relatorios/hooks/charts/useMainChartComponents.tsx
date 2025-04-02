
import React, { useMemo } from 'react';
import { BarChart } from '../../charts/BarChart';
import { LineChart } from '../../charts/LineChart';
import { PieChart } from '../../charts/PieChart';
import { AreaChart } from '../../charts/AreaChart';
import { useReportsData } from '../useReportsData';
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
              { dataKey: 'Quantidade', name: 'Quantidade', color: '#f97316' }
            ]}
          />
        ),
        'complexidadePorTema': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Complexidade', name: 'Complexidade', color: '#f97316' }
            ]}
          />
        ),
        'origemDemandas': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Solicitações', name: 'Solicitações', color: '#f97316' }
            ]}
          />
        ),
        'tempoMedioResposta': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Demandas', name: 'Dias até resposta', color: '#f97316' }
            ]}
          />
        ),
        'performanceArea': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Respostas', name: 'Quantidade', color: '#f97316' }
            ]}
          />
        ),
        'timelineRespostas': (
          <AreaChart 
            data={[]}
            xAxisDataKey="name"
            areas={[
              { dataKey: 'Respostas', name: 'Respostas', color: '#f97316' }
            ]}
          />
        ),
        'notasEmitidas': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Quantidade', name: 'Quantidade', color: '#f97316' }
            ]}
          />
        ),
        'notasPorTema': (
          <PieChart 
            data={[]}
            colors={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']}
          />
        ),
        'distribuicaoImpacto': (
          <PieChart 
            data={[]}
            colors={['#f97316', '#fb923c', '#fdba74']}
          />
        ),
        'evolucaoMensal': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Demandas', name: 'Demandas', color: '#f97316' },
              { dataKey: 'Notas', name: 'Notas', color: '#0ea5e9' }
            ]}
          />
        ),
        'comparativoAnual': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Atual', name: 'Atual', color: '#f97316' },
              { dataKey: 'Anterior', name: 'Anterior', color: '#0ea5e9' }
            ]}
          />
        ),
        'indiceSatisfacao': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Satisfação', name: 'Índice', color: '#f97316' }
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
            { dataKey: 'Quantidade', name: 'Quantidade', color: '#f97316' }
          ]}
        />
      ),
      'complexidadePorTema': (
        <BarChart 
          data={barNeighborhoodsData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: '#0ea5e9' }
          ]}
        />
      ),
      'origemDemandas': (
        <BarChart 
          data={barOriginsData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Solicitações', name: 'Quantidade', color: '#f97316' }
          ]}
        />
      ),
      'tempoMedioResposta': (
        <LineChart 
          data={lineResponseTimesData}
          xAxisDataKey="name"
          lines={[
            { dataKey: 'Demandas', name: 'Dias até resposta', color: '#f97316' }
          ]}
        />
      ),
      'performanceArea': (
        <BarChart 
          data={barCoordinationsData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Respostas', name: 'Quantidade', color: '#0ea5e9' }
          ]}
        />
      ),
      'timelineRespostas': (
        <BarChart 
          data={barResponsiblesData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Demandas criadas', color: '#f97316' }
          ]}
        />
      ),
      'notasEmitidas': (
        <BarChart 
          data={barMediaTypesData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: '#0ea5e9' }
          ]}
        />
      ),
      'notasPorTema': (
        <PieChart 
          data={pieStatusData}
          colors={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']}
        />
      ),
      'distribuicaoImpacto': (
        <PieChart 
          data={pieDistrictsData}
          colors={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']}
        />
      ),
      'evolucaoMensal': (
        <LineChart 
          data={lineResponseTimesData}
          xAxisDataKey="name"
          lines={[
            { dataKey: 'Demandas', name: 'Tempo médio (dias)', color: '#f97316' }
          ]}
        />
      ),
      'comparativoAnual': (
        <BarChart 
          data={barMediaTypesData.slice(0, 3)}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: '#f97316' }
          ]}
        />
      ),
      'indiceSatisfacao': (
        <PieChart 
          data={pieApprovalsData}
          colors={['#22c55e', '#f97316', '#ef4444']}
        />
      ),
    };
  }, [reportsData, isLoading]);

  return { chartComponents };
};
