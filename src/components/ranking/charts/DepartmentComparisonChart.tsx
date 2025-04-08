
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DepartmentComparisonChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const DepartmentComparisonChart: React.FC<DepartmentComparisonChartProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate department comparison chart data
  const generateDepartmentComparisonData = React.useMemo(() => {
    const departments = ['CPO', 'CPDU', 'CAS', 'CT', 'FISC'];
    
    // Generate data for open, in progress and completed tasks
    let completed = [65, 58, 45, 42, 38];
    let inProgress = [22, 30, 35, 28, 40];
    let open = [13, 12, 20, 30, 22];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Increase completed percentage in simulation
      completed = completed.map(value => Math.min(value + 10, 90));
      // Decrease open percentage
      open = open.map(value => Math.max(value - 5, 5));
      // Adjust in progress to make up 100%
      inProgress = departments.map((_, i) => Math.max(100 - completed[i] - open[i], 0));
    }
    
    return {
      labels: departments,
      datasets: [
        {
          label: 'Concluídas',
          data: completed,
          backgroundColor: '#0066FF',
          barPercentage: 0.7,
        },
        {
          label: 'Em Andamento',
          data: inProgress,
          backgroundColor: '#F97316',
          barPercentage: 0.7,
        },
        {
          label: 'Abertas',
          data: open,
          backgroundColor: '#64748B',
          barPercentage: 0.7,
        }
      ]
    };
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Comparação por Áreas Técnicas"
      subtitle="Execução de serviço por coordenação"
      value="CTO lidera número de demandas"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar
          data={generateDepartmentComparisonData}
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
                },
                stacked: true
              },
              x: {
                stacked: true
              }
            }
          }}
        />
      )}
    </ChartCard>
  );
};

export default DepartmentComparisonChart;
