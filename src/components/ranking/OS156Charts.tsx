
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { OS156ChartData } from './types';
import ChartCard from './charts/ChartCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="technical">Áreas Técnicas</TabsTrigger>
          <TabsTrigger value="districts">Distritos</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
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
            
            <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
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
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Análise de Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Os dados de desempenho serão exibidos aqui com base nos uploads futuros. O sistema irá calcular indicadores de eficiência considerando:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
                <li>Tempo médio de resolução por tipo de serviço</li>
                <li>Comparativo entre os status CONC (Concluído) e FECHADO (simulado)</li>
                <li>Impacto dos status PREPLAN e PRECANC na eficiência geral</li>
                <li>Pontuação de eficiência com/sem serviços indevidos</li>
              </ul>
            </CardContent>
          </Card>
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
        </ul>
      </div>
    </div>
  );
};

export default OS156Charts;
