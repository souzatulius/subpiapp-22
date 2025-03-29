
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceTypesChartProps {
  data: any;
  isLoading: boolean;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({ data, isLoading }) => {
  // Safely check if data exists and has the required properties
  const hasValidData = !isLoading && 
                       data && 
                       data.datasets && 
                       Array.isArray(data.datasets) &&
                       data.datasets.length > 0;
  
  // Create default empty arrays for labels and datasets to prevent "map of undefined" errors
  const chartData = {
    labels: (hasValidData && data.labels) ? data.labels : [],
    datasets: (hasValidData && data.datasets) ? data.datasets : []
  };
  
  return (
    <ChartCard
      title="Serviços mais solicitados"
      value={isLoading ? '' : 'Comparação'}
      isLoading={isLoading}
    >
      {hasValidData && (
        <Bar 
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  font: {
                    size: 11
                  }
                },
                title: {
                  display: true,
                  text: 'Tipos de serviço',
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                }
              },
              tooltip: {
                callbacks: {
                  title: function(tooltipItem) {
                    return `Serviço: ${tooltipItem[0].label}`;
                  },
                  label: function(context) {
                    return `Quantidade: ${context.parsed.y}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 10
                  }
                }
              },
              x: {
                ticks: {
                  font: {
                    size: 10
                  }
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default ServiceTypesChart;
