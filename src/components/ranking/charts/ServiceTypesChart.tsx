
import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { chartTheme } from './ChartRegistration';

interface ServiceTypesChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({ 
  data,
  sgzData,
  isLoading,
  isSimulationActive
}) => {
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Agrupar por tipo de serviço
    const serviceTypes: Record<string, number> = {};
    
    sgzData.forEach(order => {
      const serviceType = order.sgz_tipo_servico || 'Não informado';
      if (!serviceTypes[serviceType]) {
        serviceTypes[serviceType] = 0;
      }
      serviceTypes[serviceType]++;
    });
    
    // Ordenar e pegar os 10 mais frequentes
    const sortedServices = Object.entries(serviceTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    // Aplicar simulação se ativa
    if (isSimulationActive) {
      // Em uma simulação ideal, redistribuiríamos algumas OS de tipos externos
      // Para simplificar, não alteraremos a distribuição de tipos neste gráfico específico
    }
    
    return {
      labels: sortedServices.map(([name]) => name),
      datasets: [
        {
          label: 'Quantidade',
          data: sortedServices.map(([_, count]) => count),
          backgroundColor: chartTheme.orange.backgroundColor,
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 1,
        }
      ]
    };
  }, [sgzData, isSimulationActive]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 10
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const text = label.length > 23 ? label.substr(0, 20) + '...' : label;
                return {
                  text: `${text} (${value})`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  lineCap: 'round',
                  lineDash: [],
                  lineDashOffset: 0,
                  lineJoin: 'round',
                  lineWidth: 0,
                  strokeStyle: '#fff',
                  pointStyle: 'circle',
                  rotation: 0
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw} OS`;
          }
        }
      }
    }
  };
  
  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return '0 tipos';
    
    const uniqueTypes = new Set<string>();
    sgzData.forEach(order => {
      if (order.sgz_tipo_servico) {
        uniqueTypes.add(order.sgz_tipo_servico);
      }
    });
    
    return `${uniqueTypes.size} tipos`;
  }, [sgzData]);

  return (
    <ChartCard
      title="Distribuição por Tipo de Serviço"
      value={stats}
      isLoading={isLoading}
    >
      {chartData && (
        <Pie data={chartData} options={options} />
      )}
    </ChartCard>
  );
};

export default ServiceTypesChart;
