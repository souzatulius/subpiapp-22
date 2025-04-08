
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
            showLegend={false}
            multiColorBars={true}
          />
        ),
        'origemDemandas': (
          <PieChart 
            data={[]}
            colorSet="orange"
            showLabels={false}
            showOnlyPercentage={true}
            legendPosition="none"
            largePercentage={true}
          />
        ),
        'tempoMedioResposta': (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'Demandas', name: 'Respostas da coordenação', color: chartColors[0] },
              { dataKey: 'Aprovacao', name: 'Aprovação da nota', color: chartColors[2] }
            ]}
          />
        ),
        'performanceArea': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Demandas', name: 'Demandas no mês', color: chartColors[1] }
            ]}
            multiColorBars={true}
          />
        ),
        'notasEmitidas': (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[1] }
            ]}
            showLegend={false}
          />
        )
      };
    }

    // Transform real data for charts
    const pieDistrictsData = transformDistrictsToPieData(reportsData.districts);
    const barOriginsData = transformOriginsToBarData(reportsData.origins);
    const lineResponseTimesData = transformResponseTimesToLineData(reportsData.responseTimes);
    const barProblemasData = transformProblemasToBarData(reportsData.problemas);
    const barCoordinationsData = transformCoordinationsToBarData(reportsData.coordinations);
    const barMediaTypesData = transformMediaTypesToBarData(reportsData.mediaTypes);
    
    // Filter only needed origins - Imprensa, SMSUB, Internas
    const filteredOrigins = reportsData.origins
      .filter(item => ['Imprensa', 'SMSUB', 'Internas'].includes(item.name))
      .map(item => ({ ...item, name: item.name }));
    
    return {
      'distribuicaoPorTemas': (
        <BarChart 
          data={barProblemasData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
          ]}
          showLegend={false}
          multiColorBars={true}
          barColors={[chartColors[0], chartColors[3], chartColors[2], chartColors[1]]}
        />
      ),
      'origemDemandas': (
        <PieChart 
          data={filteredOrigins.length > 0 ? filteredOrigins : reportsData.origins}
          colorSet="orange"
          showLabels={false}
          showOnlyPercentage={true}
          legendPosition="none"
          largePercentage={true}
        />
      ),
      'tempoMedioResposta': (
        <LineChart 
          data={lineResponseTimesData}
          xAxisDataKey="name"
          yAxisTicks={[10, 20, 50, 60, 90]} // Setting y-axis ticks as requested
          lines={[
            { dataKey: 'Demandas', name: 'Respostas da coordenação', color: chartColors[0] },
            { dataKey: 'Aprovacao', name: 'Aprovação da nota', color: chartColors[2] }
          ]}
        />
      ),
      'performanceArea': (
        <BarChart 
          data={barCoordinationsData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Demandas', name: 'Demandas no mês', color: chartColors[1] }
          ]}
          multiColorBars={true}
          barColors={[chartColors[0], chartColors[3], chartColors[2], chartColors[1], chartColors[4]]}
          tooltipFormatter={(value, name, item) => [value, item.payload.fullName || name]}
        />
      ),
      'notasEmitidas': (
        <BarChart 
          data={barMediaTypesData}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[1] }
          ]}
          showLegend={false}
        />
      )
    };
  }, [reportsData, isLoading, chartColors, pieChartColors]);

  return { chartComponents };
};
