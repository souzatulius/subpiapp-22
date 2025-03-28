
import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ChartPieIcon, 
  InfoIcon, 
  FileTextIcon, 
  TrendingUpIcon, 
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FilterIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart } from './charts/PieChart';
import { BarChart } from './charts/BarChart';
import { LineChart } from './charts/LineChart';
import { AreaChart } from './charts/AreaChart';
import { StatsCard } from './components/StatsCard';
import { SectionHeader } from './sections/SectionHeader';
import { FiltersSection } from './filters/FiltersSection';
import { useReportsFilter } from './hooks/useReportsFilter';
import { useReportsData } from './hooks/useReportsData';
import { Skeleton } from '@/components/ui/skeleton';

export const RelatoriosContent: React.FC = () => {
  const { toast } = useToast();
  const { 
    filters, 
    handleDateRangeChange, 
    handleCoordenacaoChange, 
    handleTemaChange, 
    resetFilters 
  } = useReportsFilter();
  
  const { reportsData, isLoading, cardStats } = useReportsData(filters);

  // Demo coordenações and temas data - this would typically come from Supabase
  const coordenacoes = [
    { id: '1', descricao: 'Zeladoria' },
    { id: '2', descricao: 'Comunicação' },
    { id: '3', descricao: 'Gabinete' }
  ];
  
  const temas = [
    { id: '1', descricao: 'Poda de Árvores' },
    { id: '2', descricao: 'Drenagem' },
    { id: '3', descricao: 'Iluminação' },
    { id: '4', descricao: 'Pavimentação' }
  ];

  // Format cardStats data for the cards
  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num);
  const formatTempo = (dias: number) => {
    if (dias < 1) {
      return `${Math.round(dias * 24)} horas`;
    }
    return `${dias.toFixed(1)} dias`;
  };
  
  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios e Indicadores</h1>
          <p className="text-muted-foreground">Visualize e analise os dados da sua subprefeitura</p>
        </div>
        <Tabs defaultValue="charts" className="mt-4 md:mt-0">
          <TabsList>
            <TabsTrigger value="charts" className="flex items-center gap-1">
              <ChartBarIcon className="h-4 w-4" /> Gráficos
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-1">
              <FileTextIcon className="h-4 w-4" /> Tabelas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <FiltersSection 
        dateRange={filters.dateRange}
        onDateRangeChange={handleDateRangeChange}
        coordenacao={filters.coordenacao}
        onCoordenacaoChange={handleCoordenacaoChange}
        coordenacoes={coordenacoes}
        tema={filters.tema}
        onTemaChange={handleTemaChange}
        temas={temas}
        onResetFilters={resetFilters}
      />

      <Tabs defaultValue="charts">
        <TabsContent value="charts" className="mt-0">
          {/* Card Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-1/2 mb-2" />
                      <Skeleton className="h-10 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <StatsCard 
                  title="Total de Demandas"
                  value={cardStats.totalDemandas}
                  description="Total de demandas no período"
                  icon={<InfoIcon className="h-4 w-4" />}
                  change={cardStats.demandasVariacao}
                  formatter={formatNumber}
                />
                
                <StatsCard 
                  title="Notas Oficiais"
                  value={cardStats.totalNotas}
                  description="Notas publicadas no período"
                  icon={<FileTextIcon className="h-4 w-4" />}
                  change={cardStats.notasVariacao}
                  formatter={formatNumber}
                />
                
                <StatsCard 
                  title="Tempo Médio de Resposta"
                  value={cardStats.tempoMedioResposta}
                  description="Tempo médio para responder demandas"
                  icon={<CalendarIcon className="h-4 w-4" />}
                  change={cardStats.tempoRespostaVariacao}
                  formatter={formatTempo}
                />
                
                <StatsCard 
                  title="Taxa de Aprovação"
                  value={`${cardStats.taxaAprovacao}%`}
                  description="Taxa de aprovação de notas oficiais"
                  icon={<TrendingUpIcon className="h-4 w-4" />}
                  change={cardStats.aprovacaoVariacao}
                />
              </>
            )}
          </div>

          {/* Visão Geral */}
          <div className="mb-8">
            <SectionHeader 
              title="Visão Geral" 
              icon={<ChartPieIcon className="h-5 w-5 text-blue-700" />} 
              description="Distribuição geral das demandas por origem, mídia e localização" 
            />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-1/2 mb-4" />
                      <Skeleton className="h-[250px] w-full rounded-md" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <PieChart 
                  data={reportsData?.origins || []}
                  title="Solicitações por Origem" 
                  insight="A imprensa representa a maior parte das solicitações"
                />
                
                <PieChart 
                  data={reportsData?.mediaTypes || []}
                  title="Tipos de Mídia Mais Frequentes" 
                  colors={['#1EAEDB', '#0FA0CE', '#6C757D']}
                />
                
                <BarChart 
                  data={reportsData?.districts || []}
                  title="Demandas por Distrito" 
                  xAxisDataKey="name"
                  bars={[
                    { dataKey: 'value', name: 'Quantidade', color: '#1EAEDB' }
                  ]}
                  horizontal={true}
                />
              </div>
            )}
          </div>
          
          {/* Temas Técnicos */}
          <div className="mb-8">
            <SectionHeader 
              title="Temas Técnicos" 
              icon={<InfoIcon className="h-5 w-5 text-blue-700" />} 
              description="Análise das demandas por tema e serviço" 
            />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-1/2 mb-4" />
                      <Skeleton className="h-[250px] w-full rounded-md" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BarChart 
                  data={reportsData?.services || []}
                  title="Demandas por Tema" 
                  xAxisDataKey="name"
                  bars={[
                    { dataKey: 'value', name: 'Quantidade', color: '#1EAEDB' }
                  ]}
                />
                
                <PieChart 
                  data={reportsData?.coordinations || []}
                  title="Distribuição por Coordenação" 
                  colors={['#1EAEDB', '#0FA0CE', '#ea384c']}
                />
              </div>
            )}
          </div>
          
          {/* Indicadores de Tempo */}
          <div className="mb-8">
            <SectionHeader 
              title="Indicadores de Tempo e Desempenho" 
              icon={<CalendarIcon className="h-5 w-5 text-blue-700" />} 
              description="Métricas de tempo e eficiência nas respostas" 
            />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-1/2 mb-4" />
                      <Skeleton className="h-[250px] w-full rounded-md" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LineChart 
                  data={reportsData?.responseTimes || []}
                  title="Tempo Médio de Resposta (em horas)" 
                  xAxisDataKey="name"
                  lines={[
                    { dataKey: 'value', name: 'Horas', color: '#1EAEDB' }
                  ]}
                  insight="Tempo de resposta diminuiu 15% em relação ao período anterior"
                />
                
                <BarChart 
                  data={reportsData?.responsibles || []}
                  title="Demandas Atendidas por Responsável" 
                  xAxisDataKey="name"
                  bars={[
                    { dataKey: 'value', name: 'Quantidade', color: '#1EAEDB' }
                  ]}
                  insight="Top 3 responsáveis por demandas"
                />
              </div>
            )}
          </div>
          
          {/* Notas Oficiais */}
          <div className="mb-8">
            <SectionHeader 
              title="Notas Oficiais" 
              icon={<FileTextIcon className="h-5 w-5 text-blue-700" />} 
              description="Análise das notas oficiais produzidas" 
            />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-1/2 mb-4" />
                      <Skeleton className="h-[250px] w-full rounded-md" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PieChart 
                  data={reportsData?.statuses || []}
                  title="Status das Demandas" 
                  colors={['#FFC107', '#1EAEDB', '#198754']}
                />
                
                <PieChart 
                  data={reportsData?.approvals || []}
                  title="Aprovação de Notas Oficiais" 
                  colors={['#198754', '#ea384c', '#1EAEDB']}
                />
                
                <BarChart 
                  data={reportsData?.neighborhoods || []}
                  title="Notas por Bairro" 
                  xAxisDataKey="name"
                  bars={[
                    { dataKey: 'value', name: 'Quantidade', color: '#1EAEDB' }
                  ]}
                  horizontal={true}
                />
              </div>
            )}
          </div>
          
          {/* Tendências */}
          <div className="mb-8">
            <SectionHeader 
              title="Tendências" 
              icon={<TrendingUpIcon className="h-5 w-5 text-blue-700" />} 
              description="Análise de tendências e evolução no tempo" 
            />
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-[250px] w-full rounded-md" />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AreaChart 
                  data={[
                    { month: 'Jan', demandas: 28, notas: 12 },
                    { month: 'Fev', demandas: 35, notas: 15 },
                    { month: 'Mar', demandas: 42, notas: 20 },
                    { month: 'Abr', demandas: 38, notas: 17 },
                    { month: 'Mai', demandas: 50, notas: 25 },
                    { month: 'Jun', demandas: 45, notas: 22 },
                  ]}
                  title="Evolução Mensal" 
                  xAxisDataKey="month"
                  areas={[
                    { dataKey: 'demandas', name: 'Demandas', color: '#1EAEDB' },
                    { dataKey: 'notas', name: 'Notas Oficiais', color: '#0FA0CE' }
                  ]}
                  insight="Crescimento constante nas demandas nos últimos 6 meses"
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tables">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Tabelas de Dados</h2>
            <p className="text-gray-500">
              As tabelas detalhadas estarão disponíveis em breve. 
              Por enquanto, você pode visualizar os dados através dos gráficos.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
