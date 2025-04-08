
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from '@/components/relatorios/charts/BarChart';
import { PieChart } from '@/components/relatorios/charts/PieChart';
import { LineChart } from '@/components/relatorios/charts/LineChart';

interface RelatoriosGraphCardsProps {
  chartVisibility?: Record<string, boolean>;
}

const RelatoriosGraphCards: React.FC<RelatoriosGraphCardsProps> = ({
  chartVisibility = {
    origemDemandas: true,
    distribuicaoPorTemas: true,
    tempoMedioResposta: true,
    performanceArea: true,
    notasEmitidas: true,
    noticiasVsReleases: true,
    problemasComuns: true
  }
}) => {
  // Dados para o gráfico de problemas mais frequentes
  const problemasMaisFrequentes = [
    { name: 'Iluminação', value: 128 },
    { name: 'Buracos', value: 92 },
    { name: 'Poda', value: 78 },
    { name: 'Limpeza', value: 64 }
  ];

  // Dados para o gráfico de origem das demandas
  const origemDemandas = [
    { name: 'Cidadão', value: 42 },
    { name: 'Gabinete', value: 28 },
    { name: 'Mídia', value: 16 },
    { name: 'Outras', value: 14 }
  ];

  // Dados para o gráfico de áreas mais acionadas
  const areasMaisAcionadas = [
    { nome: 'CPO', valor: 38 },
    { nome: 'STLP', valor: 27 },
    { nome: 'Gabinete', valor: 22 },
    { nome: 'STM', valor: 13 }
  ];

  // Dados para o gráfico de notas de imprensa por dia do mês
  const notasImprensaPorDia = Array.from({ length: 30 }, (_, i) => ({
    dia: i + 1,
    quantidade: Math.floor(Math.random() * 5) + 1
  }));

  // Dados para o gráfico comparativo de notícias vs releases
  const noticiasVsReleases = [
    { mes: 'Jan', noticias: 42, releases: 32 },
    { mes: 'Fev', noticias: 38, releases: 30 },
    { mes: 'Mar', noticias: 45, releases: 25 },
    { mes: 'Abr', noticias: 40, releases: 28 },
    { mes: 'Mai', noticias: 35, releases: 22 }
  ];

  // Dados para o gráfico de problemas mais comuns
  const problemasComuns = [
    { name: 'Iluminação', value: 35 },
    { name: 'Buracos', value: 25 },
    { name: 'Mato Alto', value: 20 },
    { name: 'Entulho', value: 12 },
    { name: 'Árvores', value: 8 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Problemas Mais Frequentes */}
      {chartVisibility.distribuicaoPorTemas && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Problemas Mais Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart
              data={problemasMaisFrequentes}
              xAxisDataKey="name"
              bars={[
                { dataKey: 'value', name: 'Quantidade', color: '#0066FF' }
              ]}
              multiColorBars={true}
              barColors={['#0066FF', '#0C4A6E', '#64748B', '#F97316']}
              showLegend={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Origem das Demandas */}
      {chartVisibility.origemDemandas && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Origem das Demandas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-0">
            <PieChart
              data={origemDemandas}
              colorSet="blues"
              showOnlyPercentage={true}
              showLabels={false}
              legendPosition="right"
              largePercentage={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Áreas Mais Acionadas */}
      {chartVisibility.performanceArea && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Áreas Mais Acionadas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart
              data={areasMaisAcionadas}
              xAxisDataKey="nome"
              bars={[
                { dataKey: 'valor', name: 'Quantidade', color: '#0066FF' }
              ]}
              multiColorBars={true}
              barColors={['#0066FF', '#0C4A6E', '#64748B', '#F97316']}
              showLegend={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Notas de Imprensa */}
      {chartVisibility.notasEmitidas && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Notas de Imprensa</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart
              data={notasImprensaPorDia}
              xAxisDataKey="dia"
              yAxisTicks={[0, 1, 2, 3, 4, 5]}
              lines={[
                { dataKey: 'quantidade', name: 'Notas Emitidas', color: '#0066FF' }
              ]}
              showLegend={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Notícias vs Releases */}
      {chartVisibility.noticiasVsReleases && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Notícias vs Releases</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart
              data={noticiasVsReleases}
              xAxisDataKey="mes"
              lines={[
                { dataKey: 'noticias', name: 'Notícias', color: '#0066FF' },
                { dataKey: 'releases', name: 'Releases', color: '#F97316' }
              ]}
              showLegend={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Problemas Mais Comuns */}
      {chartVisibility.problemasComuns && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Problemas Mais Comuns</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-0">
            <PieChart
              data={problemasComuns}
              colorSet="mixed"
              showOnlyPercentage={true}
              showLabels={false}
              legendPosition="none"
              largePercentage={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RelatoriosGraphCards;
