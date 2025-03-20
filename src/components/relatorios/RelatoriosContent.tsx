import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Activity, Users, Calendar, Download, Printer, ChevronDown, Filter, BarChartBig, PieChartIcon, Clock, FileQuestion, Building2, CheckCircle2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart as RechartsBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, LineChart as RechartsLineChart, Line } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useAdvancedFilters } from './hooks/useAdvancedFilters';
import { useReportsData } from './hooks/useReportsData';

const RelatoriosContent = () => {
  const [activeTab, setActiveTab] = useState('geral');
  const [period, setPeriod] = useState('mensal');
  const [chartVisibility, setChartVisibility] = useState({
    district: true,
    neighborhood: true,
    origin: true,
    mediaType: true,
    responseTime: true,
    services: true,
    coordination: true,
    status: true,
    responsible: true,
    approval: true
  });

  const { 
    filters, 
    setFilters, 
    selectedFilters, 
    clearFilter, 
    clearAllFilters, 
    handleFilterChange 
  } = useAdvancedFilters();

  const { 
    reportsData, 
    isLoading, 
    cardStats 
  } = useReportsData(filters);

  const toggleChartVisibility = chartName => {
    setChartVisibility({
      ...chartVisibility,
      [chartName]: !chartVisibility[chartName]
    });
  };

  const districtData = reportsData?.districts || [];
  const neighborhoodData = reportsData?.neighborhoods || [];
  const originData = reportsData?.origins || [];
  const mediaTypeData = reportsData?.mediaTypes || [];
  const responseTimeData = reportsData?.responseTimes || [];
  const servicesData = reportsData?.services || [];
  const coordinationData = reportsData?.coordinations || [];
  const statusData = reportsData?.statuses || [];
  const responsibleData = reportsData?.responsibles || [];
  const approvalData = reportsData?.approvals || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  return (
    <div className="space-y-6">
      <div></div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <div className="space-y-1 p-2 bg-white">
                <div className="px-2 py-1.5 cursor-pointer rounded-sm hover:bg-[#F97316] hover:text-white" onClick={() => setPeriod('semanal')}>Semanal</div>
                <div className="px-2 py-1.5 cursor-pointer rounded-sm hover:bg-[#F97316] hover:text-white" onClick={() => setPeriod('mensal')}>Mensal</div>
                <div className="px-2 py-1.5 cursor-pointer rounded-sm hover:bg-[#F97316] hover:text-white" onClick={() => setPeriod('trimestral')}>Trimestral</div>
                <div className="px-2 py-1.5 cursor-pointer rounded-sm hover:bg-[#F97316] hover:text-white" onClick={() => setPeriod('anual')}>Anual</div>
              </div>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros Avançados</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filtros Avançados</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Período</label>
                  <DateRangePicker 
                    value={filters.dateRange}
                    onChange={(range) => handleFilterChange('dateRange', range)}
                    className="w-full"
                    align="start"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Distrito</label>
                  <Select 
                    value={filters.district} 
                    onValueChange={(value) => handleFilterChange('district', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="itaim-bibi">Itaim Bibi</SelectItem>
                      <SelectItem value="pinheiros">Pinheiros</SelectItem>
                      <SelectItem value="jardim-paulista">Jardim Paulista</SelectItem>
                      <SelectItem value="alto-de-pinheiros">Alto de Pinheiros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em-andamento">Em andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Origem</label>
                  <Select 
                    value={filters.origin} 
                    onValueChange={(value) => handleFilterChange('origin', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="imprensa">Imprensa</SelectItem>
                      <SelectItem value="vereadores">Vereadores</SelectItem>
                      <SelectItem value="politicos">Políticos</SelectItem>
                      <SelectItem value="interno">Demandas Internas</SelectItem>
                      <SelectItem value="secom">SECOM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Limpar Filtros
                  </Button>
                  <Button size="sm" onClick={() => {}}>
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {selectedFilters.map(filter => (
            <Badge key={filter.key} variant="outline" className="flex items-center gap-1">
              <span>{filter.label}: {filter.value}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1"
                onClick={() => clearFilter(filter.key)}
              >✕</Button>
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="demandas">Demandas</TabsTrigger>
          <TabsTrigger value="notas">Notas Oficiais</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="geografico">Geográfico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Demandas
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : cardStats.totalDemandas}</div>
                <p className="text-xs text-muted-foreground">
                  {cardStats.demandasVariacao > 0 ? '+' : ''}{cardStats.demandasVariacao}% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Notas Publicadas
                </CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : cardStats.totalNotas}</div>
                <p className="text-xs text-muted-foreground">
                  {cardStats.notasVariacao > 0 ? '+' : ''}{cardStats.notasVariacao}% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tempo Médio de Resposta
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : cardStats.tempoMedioResposta} dias</div>
                <p className="text-xs text-muted-foreground">
                  {cardStats.tempoRespostaVariacao > 0 ? '+' : ''}{cardStats.tempoRespostaVariacao}% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Aprovação
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : cardStats.taxaAprovacao}%</div>
                <p className="text-xs text-muted-foreground">
                  {cardStats.aprovacaoVariacao > 0 ? '+' : ''}{cardStats.aprovacaoVariacao}% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="p-4">
            <div className="mb-2 font-medium">Gerenciamento de Exibição</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-district" checked={chartVisibility.district} onChange={() => toggleChartVisibility('district')} className="rounded" />
                <label htmlFor="chart-district" className="text-sm">Distritos</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-neighborhood" checked={chartVisibility.neighborhood} onChange={() => toggleChartVisibility('neighborhood')} className="rounded" />
                <label htmlFor="chart-neighborhood" className="text-sm">Bairros</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-origin" checked={chartVisibility.origin} onChange={() => toggleChartVisibility('origin')} className="rounded" />
                <label htmlFor="chart-origin" className="text-sm">Origem</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-mediaType" checked={chartVisibility.mediaType} onChange={() => toggleChartVisibility('mediaType')} className="rounded" />
                <label htmlFor="chart-mediaType" className="text-sm">Mídia</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-responseTime" checked={chartVisibility.responseTime} onChange={() => toggleChartVisibility('responseTime')} className="rounded" />
                <label htmlFor="chart-responseTime" className="text-sm">Tempo de Resposta</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-services" checked={chartVisibility.services} onChange={() => toggleChartVisibility('services')} className="rounded" />
                <label htmlFor="chart-services" className="text-sm">Serviços</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-coordination" checked={chartVisibility.coordination} onChange={() => toggleChartVisibility('coordination')} className="rounded" />
                <label htmlFor="chart-coordination" className="text-sm">Coordenação</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-status" checked={chartVisibility.status} onChange={() => toggleChartVisibility('status')} className="rounded" />
                <label htmlFor="chart-status" className="text-sm">Status</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-responsible" checked={chartVisibility.responsible} onChange={() => toggleChartVisibility('responsible')} className="rounded" />
                <label htmlFor="chart-responsible" className="text-sm">Responsáveis</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="chart-approval" checked={chartVisibility.approval} onChange={() => toggleChartVisibility('approval')} className="rounded" />
                <label htmlFor="chart-approval" className="text-sm">Aprovações</label>
              </div>
            </div>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            {chartVisibility.district && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Distribuição por Distrito</CardTitle>
                  <CardDescription>
                    Total de solicitações por distrito
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={districtData} margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#0088FE" name="Solicitações" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.neighborhood && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Bairros Mais Demandantes</CardTitle>
                  <CardDescription>
                    Top bairros com mais solicitações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart layout="vertical" data={neighborhoodData.slice(0, 5)} margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5
                  }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#00C49F" name="Solicitações" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.origin && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Origem das Demandas</CardTitle>
                  <CardDescription>
                    Distribuição por origem das solicitações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={originData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                      name,
                      percent
                    }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                          {originData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.mediaType && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Tipos de Mídia</CardTitle>
                  <CardDescription>
                    Solicitações por tipo de veículo de mídia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={mediaTypeData} margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#FFBB28" name="Solicitações" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.responseTime && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Tempo Médio de Resposta</CardTitle>
                  <CardDescription>
                    Evolução do tempo de resposta (em horas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={responseTimeData} margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{
                      r: 8
                    }} name="Horas" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.services && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Principais Serviços Solicitados</CardTitle>
                  <CardDescription>
                    Assuntos mais frequentes nas demandas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={servicesData} margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#FF8042" name="Solicitações" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.coordination && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Áreas de Coordenação Mais Acionadas</CardTitle>
                  <CardDescription>
                    Áreas mais demandadas da Subprefeitura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={coordinationData} margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Solicitações" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.status && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Status das Solicitações</CardTitle>
                  <CardDescription>
                    Distribuição das demandas por status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={statusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                      name,
                      percent
                    }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                          {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.responsible && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Responsáveis pelo Atendimento</CardTitle>
                  <CardDescription>
                    Distribuição de solicitações por responsável
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart layout="vertical" data={responsibleData} margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5
                  }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" name="Solicitações atendidas" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}

            {chartVisibility.approval && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Aprovações da Nota Oficial</CardTitle>
                  <CardDescription>
                    Status das aprovações das notas enviadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={approvalData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                      name,
                      percent
                    }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                          {approvalData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>}
          </div>
        </TabsContent>
        
        <TabsContent value="demandas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Demandas</CardTitle>
              <CardDescription>
                Estatísticas e métricas detalhadas sobre as demandas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Demandas por Origem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie data={originData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                          name,
                          percent
                        }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                            {originData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tempo de Resposta por Origem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={originData.map(item => ({
                        ...item,
                        responseTime: Math.round(Math.random() * 48 + 12)
                      }))} margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                      }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="responseTime" fill="#8884d8" name="Horas" />
                      </RechartsBarChart>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Notas Oficiais</CardTitle>
              <CardDescription>
                Estatísticas sobre notas oficiais publicadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aprovação de Notas Oficiais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie data={approvalData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                          name,
                          percent
                        }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                            {approvalData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notas por Área de Coordenação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={coordinationData} margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                      }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#00C49F" name="Notas" />
                      </RechartsBarChart>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Usuários</CardTitle>
              <CardDescription>
                Informações sobre atividades dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Desempenho por Usuário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart layout="vertical" data={responsibleData} margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5
                      }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" name="Demandas atendidas" />
                      </RechartsBarChart>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tempo Médio de Resposta por Usuário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart layout="vertical" data={responsibleData.map(item => ({
                        ...item,
                        responseTime: Math.round(Math.random() * 48 + 12)
                      }))} margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5
                      }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="responseTime" fill="#FF8042" name="Horas" />
                      </RechartsBarChart>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="geografico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Geográfico</CardTitle>
              <CardDescription>
                Distribuição geográfica das demandas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Demandas por Distrito</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={districtData} margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                      }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#0088FE" name="Demandas" />
                      </RechartsBarChart>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Bairros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart layout="vertical" data={neighborhoodData.slice(0, 5)} margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5
                      }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#00C49F" name="Demandas" />
                      </RechartsBarChart>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosContent;
