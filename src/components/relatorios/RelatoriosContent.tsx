import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Activity, Users, Calendar, Download, Printer, ChevronDown, Filter, BarChartBig, PieChartIcon, Clock, FileQuestion, Building2, CheckCircle2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart as RechartsBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, LineChart as RechartsLineChart, Line } from 'recharts';

// Dados de exemplo para os gráficos
const districtData = [{
  name: 'Itaim Bibi',
  value: 78
}, {
  name: 'Pinheiros',
  value: 65
}, {
  name: 'Jardim Paulista',
  value: 42
}, {
  name: 'Alto de Pinheiros',
  value: 35
}];
const neighborhoodData = [{
  name: 'Vila Olímpia',
  district: 'Itaim Bibi',
  value: 32
}, {
  name: 'Vila Nova Conceição',
  district: 'Itaim Bibi',
  value: 28
}, {
  name: 'Brooklin',
  district: 'Itaim Bibi',
  value: 18
}, {
  name: 'Pinheiros Centro',
  district: 'Pinheiros',
  value: 30
}, {
  name: 'Vila Madalena',
  district: 'Pinheiros',
  value: 35
}, {
  name: 'Jardins',
  district: 'Jardim Paulista',
  value: 25
}, {
  name: 'Cerqueira César',
  district: 'Jardim Paulista',
  value: 17
}, {
  name: 'Alto de Pinheiros Centro',
  district: 'Alto de Pinheiros',
  value: 20
}, {
  name: 'Vila Beatriz',
  district: 'Alto de Pinheiros',
  value: 15
}];
const originData = [{
  name: 'Imprensa',
  value: 45
}, {
  name: 'Vereadores',
  value: 20
}, {
  name: 'Políticos',
  value: 15
}, {
  name: 'Demandas Internas',
  value: 25
}, {
  name: 'SECOM',
  value: 10
}, {
  name: 'Ministério Público',
  value: 8
}, {
  name: 'Ouvidoria',
  value: 12
}];
const mediaTypeData = [{
  name: 'Jornal Impresso',
  value: 25
}, {
  name: 'Portal de Notícias',
  value: 42
}, {
  name: 'Jornal Online',
  value: 38
}, {
  name: 'Podcast',
  value: 15
}, {
  name: 'Rádio',
  value: 22
}, {
  name: 'TV',
  value: 30
}];
const responseTimeData = [{
  name: 'Jan',
  value: 48
}, {
  name: 'Fev',
  value: 42
}, {
  name: 'Mar',
  value: 36
}, {
  name: 'Abr',
  value: 24
}, {
  name: 'Mai',
  value: 30
}, {
  name: 'Jun',
  value: 26
}, {
  name: 'Jul',
  value: 20
}];
const servicesData = [{
  name: 'Zeladoria',
  value: 65
}, {
  name: 'Infraestrutura',
  value: 50
}, {
  name: 'Saúde',
  value: 30
}, {
  name: 'Transporte',
  value: 45
}, {
  name: 'Educação',
  value: 25
}, {
  name: 'Eventos',
  value: 35
}];
const coordinationData = [{
  name: 'Zeladoria',
  value: 85
}, {
  name: 'Comunicação',
  value: 60
}, {
  name: 'Gabinete',
  value: 45
}, {
  name: 'Jurídico',
  value: 30
}, {
  name: 'Planejamento',
  value: 55
}];
const statusData = [{
  name: 'Pendentes',
  value: 35
}, {
  name: 'Em andamento',
  value: 45
}, {
  name: 'Concluídas',
  value: 120
}];
const responsibleData = [{
  name: 'Ana Silva',
  value: 45
}, {
  name: 'Carlos Santos',
  value: 38
}, {
  name: 'Patrícia Lima',
  value: 52
}, {
  name: 'Roberto Costa',
  value: 30
}, {
  name: 'Juliana Ferreira',
  value: 25
}];
const approvalData = [{
  name: 'Aprovadas pelo Subprefeito',
  value: 68
}, {
  name: 'Rejeitadas e reeditadas',
  value: 12
}, {
  name: 'Aprovadas sem edição',
  value: 45
}, {
  name: 'Aguardando aprovação',
  value: 25
}];

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
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
  const toggleChartVisibility = chartName => {
    setChartVisibility({
      ...chartVisibility,
      [chartName]: !chartVisibility[chartName]
    });
  };
  return <div className="space-y-6">
      <div>
        
        
      </div>

      {/* Filtros e controles */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="mensal">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <div className="space-y-1 p-2 bg-gray-50">
                <div onClick={() => setPeriod('semanal')} className="px-2 py-1.5 cursor-pointer rounded-sm bg-zinc-300">Semanal</div>
                <div className="px-2 py-1.5 cursor-pointer hover:bg-muted rounded-sm" onClick={() => setPeriod('mensal')}>Mensal</div>
                <div className="px-2 py-1.5 cursor-pointer hover:bg-muted rounded-sm" onClick={() => setPeriod('trimestral')}>Trimestral</div>
                <div className="px-2 py-1.5 cursor-pointer hover:bg-muted rounded-sm" onClick={() => setPeriod('anual')}>Anual</div>
              </div>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros Avançados</span>
          </Button>

          <Badge variant="outline" className="flex items-center gap-1">
            <span>Período: Últimos 30 dias</span>
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1">✕</Button>
          </Badge>
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
          {/* Indicadores em cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Demandas
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">
                  +12% em relação ao mês passado
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
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  +4% em relação ao mês passado
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
                <div className="text-2xl font-bold">2.5 dias</div>
                <p className="text-xs text-muted-foreground">
                  -15% em relação ao mês passado
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
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  +5% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gerenciamento de Exibição */}
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
          
          {/* Gráficos */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* 1. Distribuição por Distrito */}
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

            {/* 2. Bairros mais demandantes */}
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

            {/* 3. Origem das Demandas */}
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

            {/* 4. Tipos de Mídia */}
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

            {/* 5. Tempo Médio de Resposta */}
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

            {/* 6. Principais Serviços Solicitados */}
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

            {/* 7. Áreas de Coordenação Mais Acionadas */}
            {chartVisibility.coordination && <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Áreas de Coordenação</CardTitle>
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

            {/* 8. Status das Solicitações */}
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

            {/* 9. Responsáveis pelo Atendimento */}
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

            {/* 10. Aprovações da Nota Oficial */}
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
                      </ResponsiveContainer>
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
                      </ResponsiveContainer>
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
                      </ResponsiveContainer>
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
                      </ResponsiveContainer>
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
                      </ResponsiveContainer>
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
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default RelatoriosContent;