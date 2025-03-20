
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartVisibility } from './RankingContent';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChartsSectionProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
}

const ChartCard = ({ 
  title, 
  value, 
  isLoading, 
  children 
}: { 
  title: string; 
  value: string | number; 
  isLoading: boolean; 
  children: React.ReactNode 
}) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
      <div className="text-2xl font-bold">
        {isLoading ? <Skeleton className="h-8 w-24" /> : value}
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <div className="h-[200px]">
          {children}
        </div>
      )}
    </CardContent>
  </Card>
);

const ChartsSection: React.FC<ChartsSectionProps> = ({
  chartData,
  isLoading,
  chartVisibility
}) => {
  if (!chartData && !isLoading) {
    return (
      <div className="text-center p-10 border rounded-lg">
        <p className="text-muted-foreground">
          Não há dados disponíveis. Por favor, faça upload de uma planilha.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gráfico 1: Distribuição de Ocorrências */}
      {chartVisibility.occurrences && (
        <ChartCard
          title="Total de Ocorrências"
          value={isLoading ? '' : chartData.occurrences.datasets[0].data.reduce((a: number, b: number) => a + b, 0)}
          isLoading={isLoading}
        >
          {!isLoading && (
            <Bar 
              data={chartData.occurrences} 
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
      )}
      
      {/* Gráfico 2: Tipos de Serviços */}
      {chartVisibility.serviceTypes && (
        <ChartCard
          title="Serviços mais solicitados"
          value={isLoading ? '' : 'Comparação'}
          isLoading={isLoading}
        >
          {!isLoading && (
            <Bar 
              data={chartData.serviceTypes} 
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
      )}
      
      {/* Gráfico 3: Tempo de Resolução */}
      {chartVisibility.resolutionTime && (
        <ChartCard
          title="Tempo médio de atendimento"
          value={isLoading ? '' : `${chartData.resolutionTime.datasets[0].data[0]} dias`}
          isLoading={isLoading}
        >
          {!isLoading && (
            <Line 
              data={chartData.resolutionTime} 
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
      )}
      
      {/* Gráfico 4: Distribuição por Bairros */}
      {chartVisibility.neighborhoods && (
        <ChartCard
          title="Ocorrências por bairro"
          value={isLoading ? '' : 'Distribuição'}
          isLoading={isLoading}
        >
          {!isLoading && (
            <Pie 
              data={chartData.neighborhoods} 
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
      )}
      
      {/* Gráfico 5: Serviços Frequentes */}
      {chartVisibility.frequentServices && (
        <ChartCard
          title="Serviços mais frequentes"
          value={isLoading ? '' : 'Por distrito'}
          isLoading={isLoading}
        >
          {!isLoading && (
            <Bar 
              data={chartData.frequentServices} 
              options={{
                maintainAspectRatio: false,
                indexAxis: 'y' as const,
                plugins: {
                  legend: {
                    position: 'top' as const,
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
      )}
      
      {/* Gráfico 6: Status */}
      {chartVisibility.statusDistribution && (
        <ChartCard
          title="Status das ordens de serviço"
          value={isLoading ? '' : 'Comparação'}
          isLoading={isLoading}
        >
          {!isLoading && (
            <Bar 
              data={chartData.statusDistribution} 
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
      )}
    </div>
  );
};

export default ChartsSection;
