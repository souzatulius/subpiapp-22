
import React, { useEffect } from 'react';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { AreaChart } from '../charts/AreaChart';
import { useReportsData } from './useReportsData';
import { useChartConfigs } from './charts/useChartConfigs';

interface UseChartComponentsProps {
  currentTheme?: string;
}

export const useChartComponents = ({ currentTheme = 'mixed' }: UseChartComponentsProps = {}) => {
  const { reportsData, isLoading } = useReportsData();
  const { themes } = useChartConfigs();
  
  // Select theme colors based on the current theme
  const themeColors = themes[currentTheme as keyof typeof themes]?.colors || themes.mixed.colors;
  const blueThemeColors = themes.blue.colors;
  const orangeThemeColors = themes.orange.colors;

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
              { dataKey: 'value', name: 'Quantidade', color: themeColors[0] }
            ]}
          />
        ),
        origemDemandas: (
          <PieChart 
            data={[]}
            colors={themeColors}
          />
        ),
        tempoMedioResposta: (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'value', name: 'Dias até resposta', color: themeColors[1] }
            ]}
          />
        ),
        performanceArea: (
          <BarChart 
            data={[]}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'value', name: 'Demandas atendidas', color: themeColors[1] }
            ]}
            horizontal={true}
          />
        ),
        notasEmitidas: (
          <AreaChart 
            data={[]}
            xAxisDataKey="name"
            areas={[
              { dataKey: 'value', name: 'Quantidade', color: themeColors[1] }
            ]}
          />
        ),
        notasPorTema: (
          <PieChart 
            data={[]}
            colors={blueThemeColors}
          />
        ),
        evolucaoMensal: (
          <LineChart 
            data={[]}
            xAxisDataKey="name"
            lines={[
              { dataKey: 'demandas', name: 'Demandas', color: themeColors[0] },
              { dataKey: 'respostas', name: 'Respostas', color: themeColors[1] }
            ]}
          />
        ),
        indiceSatisfacao: (
          <PieChart 
            data={[]}
            colors={['#22c55e', themeColors[0], '#ef4444']}
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
        { name: 'MAN', value: 92 },
        { name: 'ZEL', value: 87 },
        { name: 'URB', value: 82 },
        { name: 'SEG', value: 75 },
        { name: 'OBR', value: 68 }
      ],
      notasEmitidas: [
        { name: 'Jan', value: 12 },
        { name: 'Fev', value: 15 },
        { name: 'Mar', value: 18 },
        { name: 'Abr', value: 22 },
        { name: 'Mai', value: 24 },
        { name: 'Jun', value: 28 }
      ],
      temas: [
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
            { dataKey: 'value', name: 'Quantidade', color: themeColors[0] }
          ]}
        />
      ),
      origemDemandas: (
        <PieChart 
          data={reportsData?.origins?.length ? reportsData.origins : sampleData.origens}
          colors={orangeThemeColors}
        />
      ),
      tempoMedioResposta: (
        <LineChart 
          data={reportsData?.responseTimes?.length ? reportsData.responseTimes : sampleData.tempoResposta}
          xAxisDataKey="name"
          lines={[
            { dataKey: 'value', name: 'Dias até resposta', color: themeColors[1] }
          ]}
        />
      ),
      performanceArea: (
        <BarChart 
          data={reportsData?.coordinations?.length ? reportsData.coordinations : sampleData.coordenacoes}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'value', name: 'Demandas atendidas', color: themeColors[1] }
          ]}
          horizontal={true}
        />
      ),
      notasEmitidas: (
        <AreaChart 
          data={sampleData.notasEmitidas}
          xAxisDataKey="name"
          areas={[
            { dataKey: 'value', name: 'Quantidade', color: themeColors[1], fillOpacity: 0.6 }
          ]}
        />
      ),
      notasPorTema: (
        <PieChart 
          data={reportsData?.statuses?.length ? reportsData.statuses : sampleData.temas}
          colors={blueThemeColors}
        />
      ),
      evolucaoMensal: (
        <LineChart 
          data={sampleData.evolucao}
          xAxisDataKey="name"
          lines={[
            { dataKey: 'demandas', name: 'Demandas', color: themeColors[0] },
            { dataKey: 'respostas', name: 'Respostas', color: themeColors[1] }
          ]}
        />
      ),
      indiceSatisfacao: (
        <PieChart 
          data={reportsData?.approvals?.length ? reportsData.approvals : sampleData.satisfacao}
          colors={['#22c55e', themeColors[0], '#ef4444']}
        />
      ),
    };
  }, [reportsData, isLoading, themeColors, blueThemeColors, orangeThemeColors]);

  return { chartComponents };
};
