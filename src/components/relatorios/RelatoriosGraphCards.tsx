import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from '@/components/relatorios/charts/BarChart';
import { PieChart } from '@/components/relatorios/charts/PieChart';
import { LineChart } from '@/components/relatorios/charts/LineChart';
import { ArrowDown } from "lucide-react";
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
    problemasComuns: false,
    demandasEsic: true,
    resolucaoEsic: true
  }
}) => {
  // Dados para o gráfico de problemas mais frequentes
  const problemasMaisFrequentes = [{
    name: 'Iluminação',
    value: 128
  }, {
    name: 'Buracos',
    value: 92
  }, {
    name: 'Poda',
    value: 78
  }, {
    name: 'Limpeza',
    value: 64
  }];

  // Dados para o gráfico de origem das demandas
  const origemDemandas = [{
    name: 'Imprensa',
    value: 42
  }, {
    name: 'SMSUB',
    value: 28
  }, {
    name: 'Secom',
    value: 16
  }, {
    name: 'Outras',
    value: 14
  }];

  // Dados para o gráfico de áreas mais acionadas
  const areasTecnicas = [{
    nome: 'CPO',
    valor: 38
  }, {
    nome: 'STLP',
    valor: 27
  }, {
    nome: 'Gabinete',
    valor: 22
  }, {
    nome: 'STM',
    valor: 13
  }];

  // Dados para o gráfico de notas de imprensa por dia do mês
  const notasImprensaPorDia = Array.from({
    length: 30
  }, (_, i) => ({
    dia: i + 1,
    quantidade: Math.floor(Math.random() * 5) + 1
  })).filter((_, idx) => idx % 2 === 0); // Mostrar apenas dias alternados

  // Dados para o gráfico comparativo de notícias vs releases
  const noticiasVsReleases = [{
    mes: 'Jan',
    noticias: 42,
    releases: 32
  }, {
    mes: 'Fev',
    noticias: 38,
    releases: 30
  }, {
    mes: 'Mar',
    noticias: 45,
    releases: 25
  }, {
    mes: 'Abr',
    noticias: 40,
    releases: 28
  }, {
    mes: 'Mai',
    noticias: 35,
    releases: 22
  }];

  // Dados para o gráfico de demandas do e-SIC
  const demandasEsic = [{
    name: 'Obras',
    value: 35
  }, {
    name: 'Licitações',
    value: 25
  }, {
    name: 'Contratos',
    value: 20
  }, {
    name: 'Recursos Humanos',
    value: 12
  }, {
    name: 'Orçamento',
    value: 8
  }];

  // Dados para o gráfico de resolução do e-SIC
  const resolucaoEsic = [{
    name: 'Respondidas',
    value: 75
  }, {
    name: 'Justificadas',
    value: 25
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Problemas Frequentes */}
      {chartVisibility.distribuicaoPorTemas && <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">Problemas frequentes</CardTitle>
            <div>
              <p className="text-sm text-gray-600">Serviços mais questionados</p>
              <p className="font-semibold mt-1 text-orange-600 text-xl">32% das demandas de imprensa</p>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart data={problemasMaisFrequentes} xAxisDataKey="name" bars={[{
          dataKey: 'value',
          name: 'Quantidade',
          color: '#0066FF'
        }]} multiColorBars={true} barColors={['#F97316', '#EA580C', '#0066FF', '#64748B']} showLegend={false} />
          </CardContent>
        </Card>}

      {/* Origem das Demandas */}
      {chartVisibility.origemDemandas && <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">Origem das Demandas</CardTitle>
            <div>
              <p className="text-sm text-gray-600">De onde chegam as solicitações</p>
              <p className="font-semibold mt-1 text-orange-600 text-xl">Imprensa, SMSUB ou Secom são 82%</p>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] pt-0">
            <PieChart data={origemDemandas} colorSet="orange" showOnlyPercentage={true} showLabels={false} legendPosition="none" largePercentage={true} />
          </CardContent>
        </Card>}

      {/* Áreas Técnicas Acionadas */}
      {chartVisibility.performanceArea && <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">Áreas técnicas acionadas</CardTitle>
            <div>
              <p className="text-sm text-gray-600">Coordenações da Subprefeitura que trazem respostas</p>
              <p className="font-semibold mt-1 text-orange-600 text-xl">CPO participa 33%</p>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart data={areasTecnicas} xAxisDataKey="nome" bars={[{
          dataKey: 'valor',
          name: 'Quantidade',
          color: '#0066FF'
        }]} multiColorBars={true} barColors={['#F97316', '#334155', '#EA580C', '#0066FF']} horizontal={true} showLegend={false} />
          </CardContent>
        </Card>}

      {/* Notas de Imprensa */}
      {chartVisibility.notasEmitidas && <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">Notas Imprensa</CardTitle>
            <div>
              <p className="text-sm text-gray-600">Posicionamentos enviados pela Subprefeitura</p>
              <p className="font-semibold mt-1 text-orange-600 text-xl">Máximo de 8 em um dia</p>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart data={notasImprensaPorDia} xAxisDataKey="dia" yAxisTicks={[0, 1, 2, 3, 4, 5]} lines={[{
          dataKey: 'quantidade',
          name: 'Notas Emitidas',
          color: '#0066FF'
        }]} showLegend={false} />
          </CardContent>
        </Card>}

      {/* Notícias vs Releases */}
      {chartVisibility.noticiasVsReleases && <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">Notícias vs Releases</CardTitle>
            <div>
              <p className="text-sm text-gray-600">Emails recebidos publicados como notícias do site</p>
              <p className="font-semibold mt-1 text-orange-600 text-xl">Crescimento de 15% no mês</p>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart data={noticiasVsReleases} xAxisDataKey="mes" lines={[{
          dataKey: 'noticias',
          name: 'Notícias',
          color: '#0066FF'
        }, {
          dataKey: 'releases',
          name: 'Releases',
          color: '#F97316'
        }]} showLegend={true} />
          </CardContent>
        </Card>}

      {/* Demandas do e-SIC */}
      {chartVisibility.demandasEsic && <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">Demandas do e-SIC: Temas</CardTitle>
            <div>
              <p className="text-sm text-gray-600">Principais assuntos solicitados</p>
              <p className="text-sm font-semibold mt-1 text-orange-600">Obras e licitações somam 60%</p>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] pt-0">
            <PieChart data={demandasEsic} colorSet="mixed" showOnlyPercentage={true} showLabels={false} legendPosition="none" largePercentage={true} />
          </CardContent>
        </Card>}

      {/* Resolução do e-SIC */}
      {chartVisibility.resolucaoEsic && <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">Resolução do e-SIC</CardTitle>
            <div>
              <p className="text-sm text-gray-600">Porcentagem de processos e justificativas</p>
              <p className="text-sm font-semibold mt-1 text-orange-600">75% com resposta completa</p>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] pt-0">
            <PieChart data={resolucaoEsic} colorSet="blue" showOnlyPercentage={true} showLabels={false} legendPosition="right" largePercentage={true} />
          </CardContent>
        </Card>}
    </div>;
};
export default RelatoriosGraphCards;