
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface EvolutionChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const EvolutionChart: React.FC<EvolutionChartProps> = ({ 
  data, 
  sgzData, 
  painelData, 
  isLoading,
  isSimulationActive
}) => {
  // Mock data generation for evolution chart
  const generateEvolutionData = React.useMemo(() => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    
    // Basic data
    const pendingData = days.map(() => Math.floor(Math.random() * 15) + 10);
    let completedData = days.map(() => Math.floor(Math.random() * 40) + 30);
    let canceledData = days.map(() => Math.floor(Math.random() * 10) + 5);
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Increase completed percentage in simulation
      completedData = completedData.map(value => Math.min(value + 10, 70));
      // Decrease canceled percentage
      canceledData = canceledData.map(value => Math.max(value - 3, 2));
    }
    
    return {
      labels: days,
      datasets: [
        {
          label: 'Concluídas',
          data: completedData,
          backgroundColor: '#0066FF',
          barPercentage: 0.7,
        },
        {
          label: 'Pendentes',
          data: pendingData,
          backgroundColor: '#F97316',
          barPercentage: 0.7,
        },
        {
          label: 'Canceladas',
          data: canceledData,
          backgroundColor: '#64748B',
          barPercentage: 0.7,
        }
      ]
    };
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Serviços em Andamento"
      subtitle="Evolução dos status de serviços na semana"
      value="25,0%"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar
          data={generateEvolutionData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  boxWidth: 12,
                  boxHeight: 12,
                  font: {
                    size: 11
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y}%`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              },
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default EvolutionChart;
