
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceDiversityChartProps {
  data: any;
  isLoading: boolean;
}

const ServiceDiversityChart: React.FC<ServiceDiversityChartProps> = ({ data, isLoading }) => {
  // Create a fallback empty data structure when data is not available
  const safeData = React.useMemo(() => {
    if (!data || !data.datasets) {
      return {
        labels: [],
        datasets: [{
          label: 'No data',
          data: [],
          backgroundColor: '#ccc',
        }]
      };
    }
    return data;
  }, [data]);
  
  // Calculate total services safely
  const totalServices = React.useMemo(() => {
    if (isLoading || !data || !data.datasets || !data.datasets[0] || !data.datasets[0].data) {
      return 0;
    }
    return data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  }, [data, isLoading]);
  
  // Calculate average index safely
  const averageIndex = React.useMemo(() => {
    if (totalServices === 0 || !data || !data.labels) {
      return 0;
    }
    return (totalServices / (data.labels.length || 1)).toFixed(1);
  }, [totalServices, data]);
  
  return (
    <ChartCard
      title="Diversidade de Serviços por Região"
      value={isLoading ? '' : `Índice médio: ${averageIndex}`}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar 
          data={safeData} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom' as const,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    return `${label}: ${context.parsed.y}`;
                  }
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 1
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default ServiceDiversityChart;
