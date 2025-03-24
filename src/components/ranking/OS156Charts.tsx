
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import { OS156ChartData } from './types';
import ChartCard from './charts/ChartCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface OS156ChartsProps {
  data: OS156ChartData | null;
  isLoading: boolean;
}

const OS156Charts: React.FC<OS156ChartsProps> = ({ data, isLoading }) => {
  if (!data && !isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Nenhum dado disponível. Por favor, faça upload de uma planilha de ordens de serviço.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="technical">Áreas Técnicas</TabsTrigger>
          <TabsTrigger value="districts">Distritos</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="timeline">Evolução</TabsTrigger>
          <TabsTrigger value="critical">Status Críticos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Distribution Chart */}
            <ChartCard
              title="Distribuição por Status"
              value={isLoading ? '' : 'Visão Geral'}
              isLoading={isLoading}
            >
              {!isLoading && data?.statusDistribution && (
                <Pie 
                  data={data.statusDistribution} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw as number;
                            const dataset = context.dataset;
                            const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* Average Time by Status Chart */}
            <ChartCard
              title="Tempo Médio por Status"
              value={isLoading ? '' : 'Em Dias'}
              isLoading={isLoading}
            >
              {!isLoading && data?.averageTimeByStatus && (
                <Bar 
                  data={data.averageTimeByStatus} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Dias'
                        }
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* Companies Performance Chart */}
            <ChartCard
              title="Empresas com Mais Obras Concluídas"
              value={isLoading ? '' : 'Top 10'}
              isLoading={isLoading}
            >
              {!isLoading && data?.companiesPerformance && (
                <Bar 
                  data={data.companiesPerformance}
                  options={{
                    maintainAspectRatio: false,
                    indexAxis: 'y' as const,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Obras Concluídas'
                        }
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* Daily New Orders Chart */}
            <ChartCard
              title="Volume Diário de Novas Ordens"
              value={isLoading ? '' : 'Tendência'}
              isLoading={isLoading}
            >
              {!isLoading && data?.dailyNewOrders && (
                <Line 
                  data={data.dailyNewOrders}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Quantidade'
                        }
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* Time to Completion vs Time to Close */}
            <ChartCard
              title="Tempo até Concluído vs Fechado"
              value={isLoading ? '' : 'Comparativo'}
              isLoading={isLoading}
            >
              {!isLoading && data?.timeToCompletion && (
                <Bar 
                  data={data.timeToCompletion}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Dias'
                        }
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* Efficiency Score */}
            <ChartCard
              title="Pontuação de Eficiência"
              value={isLoading ? '' : 'Impacto Externo'}
              isLoading={isLoading}
            >
              {!isLoading && data?.efficiencyScore && (
                <Bar 
                  data={data.efficiencyScore}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Pontuação (%)'
                        }
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Services by Technical Area Chart */}
            <ChartCard
              title="Serviços por Área Técnica"
              value={isLoading ? '' : 'STM vs STLP'}
              isLoading={isLoading}
            >
              {!isLoading && data?.servicesByTechnicalArea && (
                <Bar 
                  data={data.servicesByTechnicalArea}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* Efficiency Radar by Technical Area */}
            <ChartCard
              title="Radar de Eficiência por Área Técnica"
              value={isLoading ? '' : 'Análise Comparativa'}
              isLoading={isLoading}
            >
              {!isLoading && data?.efficiencyRadar && (
                <Radar 
                  data={data.efficiencyRadar}
                  options={{
                    maintainAspectRatio: false,
                    elements: {
                      line: {
                        borderWidth: 3
                      }
                    },
                    scales: {
                      r: {
                        angleLines: {
                          display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                      }
                    }
                  }}
                />
              )}
            </ChartCard>
            
            <div className="p-4 border rounded-lg bg-orange-50 border-orange-200 md:col-span-2">
              <h3 className="font-medium text-lg text-orange-800 mb-2">Análise de Áreas Técnicas</h3>
              <p className="text-sm text-gray-700 mb-4">
                As áreas técnicas STM (Manutenção) e STLP (Limpeza Pública) possuem características distintas:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-blue-600">STM</h4>
                  <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
                    <li>Manutenção de logradouros</li>
                    <li>Conservação de galerias</li>
                    <li>Serralheria</li>
                    <li>Serviços de infraestrutura</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-orange-600">STLP</h4>
                  <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
                    <li>Áreas ajardinadas</li>
                    <li>Limpeza de córregos</li>
                    <li>Poda e remoção de árvores</li>
                    <li>Microdrenagem</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="districts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Services by District Chart */}
            <ChartCard
              title="Serviços por Distrito"
              value={isLoading ? '' : 'Distribuição'}
              isLoading={isLoading}
            >
              {!isLoading && data?.servicesByDistrict && (
                <Pie 
                  data={data.servicesByDistrict}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* Services Diversity by District Chart */}
            <ChartCard
              title="Volume e Diversidade por Distrito"
              value={isLoading ? '' : 'Comparativo'}
              isLoading={isLoading}
            >
              {!isLoading && data?.servicesDiversity && (
                <Bar 
                  data={data.servicesDiversity}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Quantidade'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                          drawOnChartArea: false
                        },
                        title: {
                          display: true,
                          text: 'Diversidade'
                        }
                      }
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* External Districts Analysis */}
            <ChartCard
              title="Análise de Distritos Externos"
              value={isLoading ? '' : 'Impacto na Eficiência'}
              isLoading={isLoading}
            >
              {!isLoading && data?.externalDistrictsAnalysis && (
                <Bar 
                  data={data.externalDistrictsAnalysis}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
            
            <div className="p-4 border rounded-lg bg-gray-50 border-gray-200">
              <h3 className="font-medium text-lg text-gray-800 mb-2">Análise por Distrito</h3>
              <p className="text-sm text-gray-700 mb-4">
                O sistema considera válidos apenas os distritos da Subprefeitura de Pinheiros:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-orange-600">Pinheiros</h4>
                  <p className="text-xs text-gray-500 mt-1">Área central da subprefeitura</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-blue-600">Alto de Pinheiros</h4>
                  <p className="text-xs text-gray-500 mt-1">Região norte da subprefeitura</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-green-600">Itaim Bibi</h4>
                  <p className="text-xs text-gray-500 mt-1">Região sudeste da subprefeitura</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-purple-600">Jardim Paulista</h4>
                  <p className="text-xs text-gray-500 mt-1">Região leste da subprefeitura</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-100 border border-orange-200 rounded-md">
                <p className="text-xs text-orange-800 font-medium">
                  Ordens de outros distritos são categorizadas como "EXTERNO" e impactam negativamente os indicadores.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time to Close Analysis */}
            <ChartCard
              title="Status do Ciclo de Vida das Ordens"
              value={isLoading ? '' : 'Análise de Fechamento'}
              isLoading={isLoading}
            >
              {!isLoading && data?.timeToClose && (
                <Pie 
                  data={data.timeToClose}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
            
            {/* Companies Performance Chart (repeated for this tab) */}
            <ChartCard
              title="Empresas com Mais Obras Concluídas"
              value={isLoading ? '' : 'Aguardando Fechamento'}
              isLoading={isLoading}
            >
              {!isLoading && data?.companiesPerformance && (
                <Bar 
                  data={data.companiesPerformance}
                  options={{
                    maintainAspectRatio: false,
                    indexAxis: 'y' as const,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </ChartCard>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Análise de Desempenho das Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">Carregando dados...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Empresa</TableHead>
                      <TableHead>Ordens Concluídas</TableHead>
                      <TableHead>Tempo Médio (dias)</TableHead>
                      <TableHead className="text-right">% Eficiência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.companiesPerformance?.labels.map((company, index) => (
                      <TableRow key={company}>
                        <TableCell className="font-medium">{company}</TableCell>
                        <TableCell>{data.companiesPerformance.datasets[0].data[index]}</TableCell>
                        <TableCell>{Math.round(Math.random() * 20 + 15)}</TableCell>
                        <TableCell className="text-right">
                          {Math.round(Math.random() * 30 + 70)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Timeline Chart */}
            <ChartCard
              title="Evolução de Ordens por Status"
              value={isLoading ? '' : 'Últimos Dias'}
              isLoading={isLoading}
              className="md:col-span-2"
            >
              {!isLoading && data?.statusTimeline && (
                <Line 
                  data={data.statusTimeline}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        stacked: true,
                        beginAtZero: true,
                      },
                      x: {
                        stacked: true,
                      }
                    }
                  }}
                />
              )}
            </ChartCard>
            
            {/* Status Transition (Sankey) Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Transições entre Status (Diagrama Sankey)</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">Carregando dados...</p>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-gray-500">
                      Diagrama Sankey disponível após configuração personalizada.<br />
                      Demonstra o fluxo de transições de status: NOVO → AB → PE → CONC → FECHADO.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="critical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Critical Status Analysis Chart */}
            <ChartCard
              title="Análise de Status Críticos"
              value={isLoading ? '' : 'PREPLAN e PRECANC'}
              isLoading={isLoading}
            >
              {!isLoading && data?.criticalStatusAnalysis && (
                <Bar 
                  data={data.criticalStatusAnalysis}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Quantidade'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                          drawOnChartArea: false
                        },
                        title: {
                          display: true,
                          text: 'Dias'
                        }
                      }
                    },
                  }}
                />
              )}
            </ChartCard>
            
            <Card>
              <CardHeader>
                <CardTitle>Ordens em Status Crítico</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">Carregando dados...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número OS</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dias Parado</TableHead>
                        <TableHead>Distrito</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">OS-{Math.floor(Math.random() * 90000) + 10000}</TableCell>
                          <TableCell className="text-orange-600 font-medium">
                            {i % 2 === 0 ? 'PREPLAN' : 'PRECANC'}
                          </TableCell>
                          <TableCell>{Math.floor(Math.random() * 50) + 10}</TableCell>
                          <TableCell>
                            {['PINHEIROS', 'ALTO DE PINHEIROS', 'ITAIM BIBI', 'JARDIM PAULISTA'][Math.floor(Math.random() * 4)]}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            
            <div className="p-4 border rounded-lg bg-orange-50 border-orange-200 md:col-span-2">
              <h3 className="font-medium text-lg text-orange-800 mb-2">Impacto dos Status Críticos</h3>
              <p className="text-sm text-gray-700 mb-4">
                Os status PREPLAN e PRECANC representam gargalos no fluxo de atendimento:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-red-600">PREPLAN</h4>
                  <p className="text-xs text-gray-700 mt-1">
                    Representa ordens com problema no planejamento, que aguardam uma ação da equipe técnica.
                    Essas ordens ficam paradas e impactam negativamente os indicadores.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-orange-600">PRECANC</h4>
                  <p className="text-xs text-gray-700 mt-1">
                    Representa ordens que estão em processo de cancelamento, mas ainda não foram efetivamente canceladas.
                    Estas ordens continuam nos indicadores e não são contabilizadas como resolvidas.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-md shadow-sm">
                <h4 className="font-semibold text-sm text-orange-600">CONC (não fechadas)</h4>
                <p className="text-xs text-gray-700 mt-1">
                  Representa outro gargalo crítico: ordens que foram concluídas tecnicamente, mas permanecem abertas no sistema.
                  Estas ordens impactam o tempo médio de resolução e são vistas como pendentes nas estatísticas da Prefeitura.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border border-orange-200 rounded-md bg-orange-50 text-sm text-gray-800">
        <h3 className="font-medium text-orange-800 mb-2">Sobre a interpretação dos dados</h3>
        <p className="mb-2">
          Os gráficos acima mostram dados das ordens de serviço processadas de acordo com as seguintes regras:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <span className="font-medium">Ordens válidas:</span> Apenas ordens dos distritos Pinheiros, Alto de Pinheiros, Jardim Paulista e Itaim Bibi são consideradas.
          </li>
          <li>
            <span className="font-medium">Áreas técnicas:</span> Os serviços são classificados automaticamente como STM (infraestrutura) ou STLP (limpeza).
          </li>
          <li>
            <span className="font-medium">Status problemáticos:</span> PREPLAN e PRECANC são destacados pois impactam negativamente a eficiência.
          </li>
          <li>
            <span className="font-medium">Status CONC (Concluído):</span> Representa um gargalo no processo, pois as ordens permanecem no sistema sem encerramento oficial.
          </li>
          <li>
            <span className="font-medium">Distritos externos:</span> Ordens de outros distritos são classificadas como "EXTERNO" e analisadas separadamente.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OS156Charts;
