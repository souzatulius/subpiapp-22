
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from '@/components/relatorios/charts/BarChart';
import { PieChart } from '@/components/relatorios/charts/PieChart';
import { LineChart } from '@/components/relatorios/charts/LineChart';
import { ArrowDown, Search, EyeOff } from "lucide-react";

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
  // State for tracking which charts should show their analysis
  const [analysisVisibility, setAnalysisVisibility] = useState<Record<string, boolean>>({});
  
  // Toggle analysis visibility for a specific chart
  const toggleAnalysis = (chartId: string) => {
    setAnalysisVisibility(prev => ({
      ...prev,
      [chartId]: !prev[chartId]
    }));
  };
  
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
  
  // Análises dos gráficos
  const analyses = {
    problemasFrequentes: "A análise mostra que problemas de iluminação representam a maioria das demandas (32%), seguidos por reclamações de buracos nas vias públicas (23%). Problemas relacionados à poda de árvores e limpeza urbana aparecem com destaque significativo. Recomenda-se um plano de ação prioritário para iluminação pública, pois além de ser o tema mais recorrente, está diretamente relacionado à segurança urbana.",
    origemDemandas: "Os dados indicam que 42% das demandas originam-se da imprensa, demonstrando a importância da mídia como canal de comunicação com a prefeitura. SMSUB (28%) e Secom (16%) são também fontes importantes. É recomendável fortalecer o atendimento à imprensa e melhorar o fluxo de informações com estas fontes principais para aumentar a eficiência das respostas.",
    areasTecnicas: "A Coordenadoria de Projetos e Obras (CPO) é a mais demandada, respondendo por 38% das solicitações. O STLP atende 27% das chamadas, enquanto o Gabinete e STM somam juntos 35%. Estes dados sugerem a necessidade de mais recursos humanos e técnicos para a CPO, dada sua participação predominante no atendimento às demandas.",
    notasImprensa: "O gráfico demonstra uma variação significativa na emissão de notas ao longo do mês, com picos de até 8 notas em um único dia. A análise temporal sugere maior concentração de demandas em determinados dias da semana, possivelmente relacionados ao ciclo de notícias. Recomenda-se planejar a escala da equipe considerando estes picos de demanda.",
    noticiasReleases: "Observa-se uma tendência de crescimento de 15% no mês para publicações de notícias derivadas de releases. O gap entre notícias publicadas e releases enviados está diminuindo, indicando maior eficiência na comunicação. A tendência positiva sugere que a estratégia atual de comunicação está surtindo efeito e deve ser mantida com pequenos ajustes de otimização.",
    demandasEsic: "As demandas via e-SIC estão concentradas principalmente em informações sobre Obras (35%) e Licitações (25%), que somam 60% de todas as solicitações. Isto reflete o interesse público na transparência de gastos e execução de projetos. Recomenda-se aprimorar proativamente a divulgação destes dados no portal de transparência.",
    resolucaoEsic: "75% das demandas e-SIC são respondidas completamente, enquanto 25% recebem justificativas para não fornecimento integral dos dados. Esta taxa de resposta completa está acima da média nacional (68%), indicando bom desempenho da equipe. Ainda assim, há espaço para melhoria, com meta para alcançar 85% de respostas completas nos próximos 3 meses."
  };
  
  // Componente de gráfico com hover controls
  const ChartCard = ({ id, title, description, children, analysis }: { id: string, title: string, description: string, children: React.ReactNode, analysis: string }) => {
    const [isHovering, setIsHovering] = useState(false);
    const isShowingAnalysis = analysisVisibility[id] || false;
    
    return (
      <Card className="shadow-sm hover:shadow-md transition-all rounded-xl" 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
          <div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          
          {/* Hover controls */}
          <div className={`absolute top-3 right-3 flex space-x-2 transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={() => toggleAnalysis(id)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-orange-500 hover:text-orange-700 transition-colors"
              title={isShowingAnalysis ? "Mostrar gráfico" : "Mostrar análise"}
            >
              <Search size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          {isShowingAnalysis ? (
            <div className="bg-gray-50 rounded-lg p-4 h-full overflow-auto">
              <h4 className="font-medium text-gray-700 mb-2">Análise de dados</h4>
              <p className="text-gray-600 text-sm">{analysis}</p>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Problemas Frequentes */}
      {chartVisibility.distribuicaoPorTemas && (
        <ChartCard 
          id="problemasFrequentes"
          title="Problemas frequentes"
          description="Serviços mais questionados"
          analysis={analyses.problemasFrequentes}
        >
          <BarChart 
            data={problemasMaisFrequentes} 
            xAxisDataKey="name" 
            bars={[{
              dataKey: 'value',
              name: 'Quantidade',
              color: '#0066FF'
            }]} 
            multiColorBars={true} 
            barColors={['#F97316', '#EA580C', '#0066FF', '#64748B']} 
            showLegend={false} 
          />
        </ChartCard>
      )}

      {/* Origem das Demandas */}
      {chartVisibility.origemDemandas && (
        <ChartCard 
          id="origemDemandas"
          title="Origem das Demandas"
          description="De onde chegam as solicitações"
          analysis={analyses.origemDemandas}
        >
          <PieChart 
            data={origemDemandas} 
            colorSet="orange" 
            showOnlyPercentage={true} 
            showLabels={false} 
            legendPosition="none" 
            largePercentage={true} 
          />
        </ChartCard>
      )}

      {/* Áreas Técnicas Acionadas */}
      {chartVisibility.performanceArea && (
        <ChartCard 
          id="areasTecnicas"
          title="Áreas técnicas acionadas"
          description="Coordenações da Subprefeitura que trazem respostas"
          analysis={analyses.areasTecnicas}
        >
          <BarChart 
            data={areasTecnicas} 
            xAxisDataKey="nome" 
            bars={[{
              dataKey: 'valor',
              name: 'Quantidade',
              color: '#0066FF'
            }]} 
            multiColorBars={true} 
            barColors={['#F97316', '#334155', '#EA580C', '#0066FF']} 
            horizontal={true} 
            showLegend={false} 
          />
        </ChartCard>
      )}

      {/* Notas de Imprensa */}
      {chartVisibility.notasEmitidas && (
        <ChartCard 
          id="notasImprensa"
          title="Notas Imprensa"
          description="Posicionamentos enviados pela Subprefeitura"
          analysis={analyses.notasImprensa}
        >
          <LineChart 
            data={notasImprensaPorDia} 
            xAxisDataKey="dia" 
            yAxisTicks={[0, 1, 2, 3, 4, 5]} 
            lines={[{
              dataKey: 'quantidade',
              name: 'Notas Emitidas',
              color: '#0066FF'
            }]} 
            showLegend={false} 
          />
        </ChartCard>
      )}

      {/* Notícias vs Releases */}
      {chartVisibility.noticiasVsReleases && (
        <ChartCard 
          id="noticiasReleases"
          title="Notícias vs Releases"
          description="Emails recebidos publicados como notícias do site"
          analysis={analyses.noticiasReleases}
        >
          <LineChart 
            data={noticiasVsReleases} 
            xAxisDataKey="mes" 
            lines={[{
              dataKey: 'noticias',
              name: 'Notícias',
              color: '#0066FF'
            }, {
              dataKey: 'releases',
              name: 'Releases',
              color: '#F97316'
            }]} 
            showLegend={true} 
          />
        </ChartCard>
      )}

      {/* Demandas do e-SIC */}
      {chartVisibility.demandasEsic && (
        <ChartCard 
          id="demandasEsic"
          title="Demandas do e-SIC: Temas"
          description="Principais assuntos solicitados"
          analysis={analyses.demandasEsic}
        >
          <PieChart 
            data={demandasEsic} 
            colorSet="mixed" 
            showOnlyPercentage={true} 
            showLabels={false} 
            legendPosition="none" 
            largePercentage={true} 
          />
        </ChartCard>
      )}

      {/* Resolução do e-SIC */}
      {chartVisibility.resolucaoEsic && (
        <ChartCard 
          id="resolucaoEsic"
          title="Resolução do e-SIC"
          description="Porcentagem de processos e justificativas"
          analysis={analyses.resolucaoEsic}
        >
          <PieChart 
            data={resolucaoEsic} 
            colorSet="blue" 
            showOnlyPercentage={true} 
            showLabels={false} 
            legendPosition="right" 
            largePercentage={true} 
          />
        </ChartCard>
      )}
    </div>
  );
};

export default RelatoriosGraphCards;
