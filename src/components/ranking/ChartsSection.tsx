
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import OccurrencesChart from './charts/OccurrencesChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import ResolutionTimeChart from './charts/ResolutionTimeChart';
import NeighborhoodsChart from './charts/NeighborhoodsChart';
import FrequentServicesChart from './charts/FrequentServicesChart';
import StatusDistributionChart from './charts/StatusDistributionChart';
import StatusTimelineChart from './charts/StatusTimelineChart';
import TimeToCloseChart from './charts/TimeToCloseChart';
import EfficiencyRadarChart from './charts/EfficiencyRadarChart';
import CriticalStatusChart from './charts/CriticalStatusChart';
import ExternalDistrictsChart from './charts/ExternalDistrictsChart';
import ServicesDiversityChart from './charts/ServicesDiversityChart';
import CompaniesPerformanceChart from './charts/CompaniesPerformanceChart';
import AreaServicesChart from './charts/AreaServicesChart';
import DailyOrdersChart from './charts/DailyOrdersChart';

// Import chart registration
import './charts/ChartRegistration';

interface ChartsSectionProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  chartData,
  isLoading,
  chartVisibility
}) => {
  if (!chartData && !isLoading) {
    return <NoDataMessage />;
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
            {/* Chart 1: Status Distribution */}
            {chartVisibility.statusDistribution && (
              <StatusDistributionChart 
                data={chartData?.statusDistribution} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Chart 2: Resolution Time */}
            {chartVisibility.resolutionTime && (
              <ResolutionTimeChart 
                data={chartData?.averageTimeByStatus} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Chart 3: Companies Performance */}
            <CompaniesPerformanceChart 
              data={chartData?.companiesPerformance} 
              isLoading={isLoading} 
            />
            
            {/* Chart 4: Daily New Orders */}
            {chartVisibility.dailyOrders && (
              <DailyOrdersChart 
                data={chartData?.dailyNewOrders} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Chart 5: Time to Completion */}
            {chartVisibility.timeToClose && (
              <TimeToCloseChart 
                data={chartData?.timeToCompletion} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Chart 6: Efficiency Score */}
            <StatusDistributionChart 
              data={chartData?.efficiencyScore} 
              isLoading={isLoading}
              title="Pontuação de Eficiência" 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 7: Services by Technical Area */}
            <AreaServicesChart 
              data={chartData?.servicesByTechnicalArea} 
              isLoading={isLoading} 
            />
            
            {/* Chart 8: Efficiency Radar by Area */}
            {chartVisibility.efficiencyRadar && (
              <EfficiencyRadarChart 
                data={chartData?.efficiencyRadar} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Chart 9: Service Types */}
            {chartVisibility.serviceTypes && (
              <ServiceTypesChart 
                data={chartData?.servicesByTechnicalArea} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Chart 10: Frequent Services */}
            {chartVisibility.frequentServices && (
              <FrequentServicesChart 
                data={chartData?.frequentServices} 
                isLoading={isLoading} 
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="districts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 11: Services by District */}
            {chartVisibility.neighborhoods && (
              <NeighborhoodsChart 
                data={chartData?.servicesByDistrict} 
                isLoading={isLoading}
                title="Serviços por Distrito" 
              />
            )}
            
            {/* Chart 12: Services Diversity by District */}
            {chartVisibility.servicesDiversity && (
              <ServicesDiversityChart 
                data={chartData?.servicesDiversity} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Chart 13: External Districts Analysis */}
            {chartVisibility.externalDistricts && (
              <ExternalDistrictsChart 
                data={chartData?.externalDistrictsAnalysis} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Additional district info card */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 14: Time to Close Analysis */}
            <StatusDistributionChart 
              data={chartData?.timeToClose} 
              isLoading={isLoading}
              title="Status do Ciclo de Vida das Ordens" 
            />
            
            {/* Companies performance repeated for this tab */}
            <CompaniesPerformanceChart 
              data={chartData?.companiesPerformance} 
              isLoading={isLoading}
              title="Empresas com Mais Obras Concluídas Não Fechadas" 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 15: Status Timeline */}
            {chartVisibility.statusTimeline && (
              <StatusTimelineChart 
                data={chartData?.statusTimeline} 
                isLoading={isLoading}
                className="md:col-span-2" 
              />
            )}
            
            {/* Chart 16: Status Transition (Sankey) */}
            {chartVisibility.statusTransition && (
              <div className="md:col-span-2 p-4 border rounded-md">
                <h3 className="font-medium text-lg mb-2">Transições entre Status (Diagrama Sankey)</h3>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 text-center">
                    Diagrama Sankey mostrando o fluxo de transições de status.<br />
                    NOVO → AB → PE → CONC → FECHADO
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="critical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Critical Status Analysis */}
            {chartVisibility.criticalStatus && (
              <CriticalStatusChart 
                data={chartData?.criticalStatusAnalysis} 
                isLoading={isLoading} 
              />
            )}
            
            {/* Additional critical status info */}
            <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
              <h3 className="font-medium text-lg text-orange-800 mb-2">Impacto dos Status Críticos</h3>
              <p className="text-sm text-gray-700 mb-4">
                Os status PREPLAN e PRECANC representam gargalos no fluxo de atendimento:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-red-600">PREPLAN</h4>
                  <p className="text-xs text-gray-700 mt-1">
                    Representa ordens com problema no planejamento que aguardam ação da equipe técnica.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-semibold text-sm text-orange-600">PRECANC</h4>
                  <p className="text-xs text-gray-700 mt-1">
                    Representa ordens em processo de cancelamento, ainda não efetivamente canceladas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border border-orange-200 rounded-md bg-orange-50 text-sm text-gray-800">
        <h3 className="font-medium text-orange-800 mb-2">Sobre a interpretação dos dados</h3>
        <p className="mb-2">
          Os gráficos acima mostram dados das ordens de serviço processadas de acordo com:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <span className="font-medium">Ordens válidas:</span> Apenas ordens dos distritos Pinheiros, Alto de Pinheiros, Jardim Paulista e Itaim Bibi.
          </li>
          <li>
            <span className="font-medium">Áreas técnicas:</span> Os serviços são classificados automaticamente como STM (infraestrutura) ou STLP (limpeza).
          </li>
          <li>
            <span className="font-medium">Status problemáticos:</span> PREPLAN e PRECANC impactam negativamente a eficiência.
          </li>
          <li>
            <span className="font-medium">Status CONC (Concluído):</span> Representa ordens sem encerramento oficial.
          </li>
          <li>
            <span className="font-medium">Distritos externos:</span> Ordens de outros distritos são classificadas como "EXTERNO".
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChartsSection;
