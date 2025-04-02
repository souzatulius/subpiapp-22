
import React from 'react';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { AreaChart } from '../charts/AreaChart';
import { useReportsData } from './useReportsData';

export const useChartComponents = () => {
  const { reportsData, isLoading } = useReportsData();

  // Prepare chart components based on the available data
  const chartComponents = React.useMemo(() => {
    // Return empty/placeholder charts if data is loading or not available
    if (isLoading || !reportsData) {
      return {
        distribuicaoPorTemas: (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'value', name: 'Quantidade', color: '#f97316' }
            ]}
          />
        ),
        origemDemandas: (
          <PieChart 
            data={[]}
            colors={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']}
            showOnlyPercentage={true}
            showLabels={true}
          />
        ),
        tempoMedioResposta: (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            yAxisTicks={[10, 20, 50, 60, 90]}
            lines={[
              { dataKey: 'value', name: 'Respostas da coordenação', color: '#f97316' },
              { dataKey: 'aprovacao', name: 'Aprovação da nota', color: '#0ea5e9' }
            ]}
          />
        ),
        performanceArea: (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'value', name: 'Demandas no mês', color: '#0ea5e9' }
            ]}
            horizontal={true}
          />
        ),
        notasEmitidas: (
          <AreaChart 
            data={[]}
            xAxisDataKey="name"
            areas={[
              { dataKey: 'value', name: 'Quantidade', color: '#0ea5e9' }
            ]}
          />
        )
      };
    }

    // Sample data for the charts when real data isn't available
    const sampleData = {
      problemas: [
        { name: 'Poda', value: 85 },
        { name: 'Limpeza', value: 65 },
        { name: 'Iluminação', value: 42 },
        { name: 'Segurança', value: 38 },
        { name: 'Urbanismo', value: 25 },
        { name: 'Outros', value: 15 }
      ],
      origens: [
        { name: 'Imprensa', value: 120 },
        { name: 'SMSUB', value: 80 },
        { name: 'Internas', value: 60 },
        { name: 'Outros', value: 40 }
      ],
      tempoResposta: [
        { name: 'Jan', value: 45, aprovacao: 60 },
        { name: 'Fev', value: 38, aprovacao: 55 },
        { name: 'Mar', value: 30, aprovacao: 40 },
        { name: 'Abr', value: 25, aprovacao: 35 }
      ],
      coordenacoes: [
        { name: 'STLP', value: 92 },
        { name: 'STM', value: 87 },
        { name: 'GAB', value: 82 },
        { name: 'CAF', value: 75 },
        { name: 'PR', value: 68 }
      ],
      notasEmitidas: [
        { name: 'Jan', value: 12 },
        { name: 'Fev', value: 15 },
        { name: 'Mar', value: 18 },
        { name: 'Abr', value: 22 }
      ]
    };

    // Prefer real data when available, otherwise use sample data
    return {
      distribuicaoPorTemas: (
        <BarChart 
          data={reportsData?.problemas?.length ? reportsData.problemas : sampleData.problemas}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'value', name: 'Quantidade', color: '#f97316' }
          ]}
        />
      ),
      origemDemandas: (
        <PieChart 
          data={reportsData?.origins?.length ? reportsData.origins : sampleData.origens}
          colorSet="orange"
          showLabels={true}
          showOnlyPercentage={true}
        />
      ),
      tempoMedioResposta: (
        <LineChart 
          data={reportsData?.responseTimes?.length ? reportsData.responseTimes.map(item => ({
            ...item,
            aprovacao: Math.round(item.value * 1.2) // Example calculation for approval time
          })) : sampleData.tempoResposta}
          xAxisDataKey="name"
          yAxisTicks={[10, 20, 50, 60, 90]}
          lines={[
            { dataKey: 'value', name: 'Respostas da coordenação', color: '#f97316' },
            { dataKey: 'aprovacao', name: 'Aprovação da nota', color: '#0ea5e9' }
          ]}
        />
      ),
      performanceArea: (
        <BarChart 
          data={reportsData?.coordinations?.length ? reportsData.coordinations : sampleData.coordenacoes}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'value', name: 'Demandas no mês', color: '#0ea5e9' }
          ]}
          horizontal={true}
        />
      ),
      notasEmitidas: (
        <AreaChart 
          data={reportsData?.mediaTypes?.length ? reportsData.mediaTypes : sampleData.notasEmitidas}
          xAxisDataKey="name"
          areas={[
            { dataKey: 'value', name: 'Quantidade', color: '#0ea5e9', fillOpacity: 0.6 }
          ]}
        />
      )
    };
  }, [reportsData, isLoading]);

  return { chartComponents };
};
