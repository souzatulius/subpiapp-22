
import React from 'react';
import { useReportsFilter } from './hooks/useReportsFilter';
import { useReportsData } from './hooks/useReportsData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronDownIcon, BarChart, PieChart, LineChart, Activity, FileText } from "lucide-react";
import { RelatorioCard } from './components/RelatorioCard';
import { SectionHeader } from './sections/SectionHeader';
import { StatsCard } from './components/StatsCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

export const RelatoriosContent: React.FC = () => {
  const { filters, handleDateRangeChange, handleCoordenacaoChange, handleTemaChange, resetFilters } = useReportsFilter();
  const { reportsData, isLoading, cardStats } = useReportsData(filters);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Currency formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Relatórios e Indicadores</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker
            value={filters.dateRange}
            onValueChange={handleDateRangeChange}
            className="w-auto"
            align="end"
          />
          
          <Select value={filters.coordenacao} onValueChange={handleCoordenacaoChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Coordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas Coordenações</SelectItem>
              <SelectItem value="zeladoria">Zeladoria</SelectItem>
              <SelectItem value="comunicacao">Comunicação</SelectItem>
              <SelectItem value="gabinete">Gabinete</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.tema} onValueChange={handleTemaChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tema/Serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Temas</SelectItem>
              <SelectItem value="poda">Poda</SelectItem>
              <SelectItem value="zeladoria">Zeladoria</SelectItem>
              <SelectItem value="pavimentacao">Pavimentação</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1">
            <RotateCcw className="h-4 w-4" />
            <span>Limpar</span>
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>
          Período: {format(filters.dateRange.from || new Date(), 'dd/MM/yyyy', { locale: ptBR })} - {format(filters.dateRange.to || new Date(), 'dd/MM/yyyy', { locale: ptBR })}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Demandas"
          value={cardStats.totalDemandas}
          description="Demandas recebidas no período"
          icon={<BarChart className="h-4 w-4" />}
          change={cardStats.demandasVariacao}
          changeLabel="em relação ao período anterior"
        />
        
        <StatsCard
          title="Notas Oficiais"
          value={cardStats.totalNotas}
          description="Notas publicadas no período"
          icon={<FileText className="h-4 w-4" />}
          change={cardStats.notasVariacao}
          changeLabel="em relação ao período anterior"
        />
        
        <StatsCard
          title="Tempo Médio de Resposta"
          value={cardStats.tempoMedioResposta}
          description="Dias até a resposta"
          icon={<Activity className="h-4 w-4" />}
          change={cardStats.tempoRespostaVariacao}
          changeLabel="em relação ao período anterior"
          formatter={(val) => `${val} dias`}
        />
        
        <StatsCard
          title="Taxa de Aprovação"
          value={cardStats.taxaAprovacao}
          description="De notas oficiais"
          icon={<Activity className="h-4 w-4" />}
          change={cardStats.aprovacaoVariacao}
          changeLabel="em relação ao período anterior"
          formatter={(val) => `${val}%`}
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="technicalThemes">Temas Técnicos</TabsTrigger>
          <TabsTrigger value="performance">Tempo e Desempenho</TabsTrigger>
          <TabsTrigger value="notes">Notas Oficiais</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>
        
        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <SectionHeader 
            title="Visão Geral" 
            icon={<BarChart className="h-5 w-5 text-blue-600" />}
            description="Análise das demandas por origem, mídia e localização"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Demandas por Origem */}
            <RelatorioCard 
              title="Demandas por Origem"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={reportsData?.origins || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportsData?.origins?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} demandas`, 'Quantidade']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>

            {/* Tipos de Mídia */}
            <RelatorioCard 
              title="Tipos de Mídia"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={reportsData?.mediaTypes || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} demandas`, 'Quantidade']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>

            {/* Demandas por Distrito */}
            <RelatorioCard 
              title="Demandas por Distrito"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={reportsData?.districts || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => [`${value} demandas`, 'Quantidade']} />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>
          </div>
        </TabsContent>
        
        {/* Temas Técnicos */}
        <TabsContent value="technicalThemes" className="space-y-6">
          <SectionHeader 
            title="Temas Técnicos" 
            icon={<PieChart className="h-5 w-5 text-orange-500" />}
            description="Análise de demandas por tema e serviço"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Demandas por Tema */}
            <RelatorioCard 
              title="Demandas por Tema"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={reportsData?.services || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} demandas`, 'Quantidade']} />
                    <Bar dataKey="value" fill="#FF9800" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>

            {/* Distribuição de Serviços */}
            <RelatorioCard 
              title="Serviços por Coordenação"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={reportsData?.coordinations || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportsData?.coordinations?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} demandas`, 'Quantidade']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>
          </div>
        </TabsContent>
        
        {/* Tempo e Desempenho */}
        <TabsContent value="performance" className="space-y-6">
          <SectionHeader 
            title="Tempo e Desempenho" 
            icon={<LineChart className="h-5 w-5 text-green-600" />}
            description="Análise de prazos e desempenho por coordenação"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tempo Médio de Resposta */}
            <RelatorioCard 
              title="Tempo Médio de Resposta"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={reportsData?.responseTimes || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} dias`, 'Tempo Médio']} />
                    <Bar dataKey="value" fill="#4CAF50" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>

            {/* Status das Demandas */}
            <RelatorioCard 
              title="Status das Demandas"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={reportsData?.statuses || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportsData?.statuses?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} demandas`, 'Quantidade']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>
          </div>
        </TabsContent>
        
        {/* Notas Oficiais */}
        <TabsContent value="notes" className="space-y-6">
          <SectionHeader 
            title="Notas Oficiais" 
            icon={<FileText className="h-5 w-5 text-blue-800" />}
            description="Análise das notas oficiais publicadas"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status de Aprovação */}
            <RelatorioCard 
              title="Status de Aprovação"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={reportsData?.approvals || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportsData?.approvals?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} notas`, 'Quantidade']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>

            {/* Responsáveis por Notas */}
            <RelatorioCard 
              title="Responsáveis por Notas"
              className="col-span-1"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando dados...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={reportsData?.responsibles || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value} notas`, 'Quantidade']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </RelatorioCard>
          </div>
        </TabsContent>
        
        {/* Tendências */}
        <TabsContent value="trends" className="space-y-6">
          <SectionHeader 
            title="Tendências" 
            icon={<Activity className="h-5 w-5 text-purple-600" />}
            description="Análise de tendências e histórico"
          />
          
          <RelatorioCard 
            title="Demandas por Semana"
            className="col-span-1"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={reportsData?.dailyDemands || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} demandas`, 'Quantidade']} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}
          </RelatorioCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
