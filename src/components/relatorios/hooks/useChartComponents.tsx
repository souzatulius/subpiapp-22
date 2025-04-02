
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
          />
        ),
        tempoMedioResposta: (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'value', name: 'Dias até resposta', color: '#0ea5e9' }
            ]}
          />
        ),
        performanceArea: (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'value', name: 'Demandas atendidas', color: '#0ea5e9' }
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
        ),
        notasPorTema: (
          <PieChart 
            data={[]}
            colors={['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe']}
          />
        ),
        evolucaoMensal: (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'demandas', name: 'Demandas', color: '#f97316' },
              { dataKey: 'respostas', name: 'Respostas', color: '#0ea5e9' }
            ]}
          />
        ),
        indiceSatisfacao: (
          <PieChart 
            data={[]}
            colors={['#22c55e', '#f97316', '#ef4444']}
          />
        ),
      };
    }

    // Sample data for the charts when real data isn't available
    const sampleData = {
      problemas: [
        { name: 'Manutenção', value: 85 },
        { name: 'Limpeza', value: 65 },
        { name: 'Iluminação', value: 42 },
        { name: 'Segurança', value: 38 },
        { name: 'Urbanismo', value: 25 },
        { name: 'Outros', value: 15 }
      ],
      origens: [
        { name: 'Portal', value: 120 },
        { name: 'WhatsApp', value: 80 },
        { name: 'Aplicativo', value: 60 },
        { name: 'Telefone', value: 40 },
        { name: 'Presencial', value: 20 }
      ],
      tempoResposta: [
        { name: 'Jan', value: 7.2 },
        { name: 'Fev', value: 6.8 },
        { name: 'Mar', value: 5.9 },
        { name: 'Abr', value: 5.2 },
        { name: 'Mai', value: 4.8 },
        { name: 'Jun', value: 4.3 }
      ],
      coordenacoes: [
        { name: 'Manutenção', value: 92 },
        { name: 'Zeladoria', value: 87 },
        { name: 'Urbanismo', value: 82 },
        { name: 'Segurança', value: 75 },
        { name: 'Obras', value: 68 }
      ],
      notasEmitidas: [
        { name: 'Jan', value: 12 },
        { name: 'Fev', value: 15 },
        { name: 'Mar', value: 18 },
        { name: 'Abr', value: 22 },
        { name: 'Mai', value: 24 },
        { name: 'Jun', value: 28 }
      ],
      temasTecnicos: [
        { name: 'Eventos', value: 28 },
        { name: 'Obras', value: 22 },
        { name: 'Saúde', value: 18 },
        { name: 'Educação', value: 15 },
        { name: 'Serviços', value: 12 },
        { name: 'Outros', value: 5 }
      ],
      evolucao: [
        { name: 'Jan', demandas: 150, respostas: 120 },
        { name: 'Fev', demandas: 180, respostas: 155 },
        { name: 'Mar', demandas: 220, respostas: 190 },
        { name: 'Abr', demandas: 200, respostas: 180 },
        { name: 'Mai', demandas: 240, respostas: 220 },
        { name: 'Jun', demandas: 260, respostas: 240 }
      ],
      satisfacao: [
        { name: 'Satisfeito', value: 78 },
        { name: 'Neutro', value: 15 },
        { name: 'Insatisfeito', value: 7 }
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
          colors={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']}
        />
      ),
      tempoMedioResposta: (
        <LineChart 
          data={reportsData?.responseTimes?.length ? reportsData.responseTimes : sampleData.tempoResposta}
          xAxisDataKey="name"
          lines={[
            { dataKey: 'value', name: 'Dias até resposta', color: '#0ea5e9' }
          ]}
        />
      ),
      performanceArea: (
        <BarChart 
          data={reportsData?.coordinations?.length ? reportsData.coordinations : sampleData.coordenacoes}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'value', name: 'Demandas atendidas', color: '#0ea5e9' }
          ]}
          horizontal={true}
        />
      ),
      notasEmitidas: (
        <AreaChart 
          data={sampleData.notasEmitidas}
          xAxisDataKey="name"
          areas={[
            { dataKey: 'value', name: 'Quantidade', color: '#0ea5e9', fillOpacity: 0.6 }
          ]}
        />
      ),
      notasPorTema: (
        <PieChart 
          data={reportsData?.temasTecnicos?.length ? reportsData.temasTecnicos : sampleData.temasTecnicos}
          colors={['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe']}
        />
      ),
      evolucaoMensal: (
        <LineChart 
          data={sampleData.evolucao}
          xAxisDataKey="name"
          lines={[
            { dataKey: 'demandas', name: 'Demandas', color: '#f97316' },
            { dataKey: 'respostas', name: 'Respostas', color: '#0ea5e9' }
          ]}
        />
      ),
      indiceSatisfacao: (
        <PieChart 
          data={reportsData?.approvals?.length ? reportsData.approvals : sampleData.satisfacao}
          colors={['#22c55e', '#f97316', '#ef4444']}
        />
      ),
    };
  }, [reportsData, isLoading]);

  return { chartComponents };
};
