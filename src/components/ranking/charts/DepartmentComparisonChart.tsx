
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
    const departments = [
      'CTO',
      'Fiscalização',
      'Eng. Tráfego',
      'COMDEC',
      'Planejamento'
    ];
    
    // Generate random values
    let closedValues = [85, 72, 65, 58, 45];
    let pendingValues = [15, 28, 35, 42, 55];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Improved closed rates in simulation
      closedValues = closedValues.map(val => Math.min(val + 10, 100));
      // Calculate pending as remainder to always sum to 100%
      pendingValues = closedValues.map(val => 100 - val);
    }
    
    return {
      labels: departments,
      datasets: [
        {
          label: 'Concluídas',
          data: closedValues,
          backgroundColor: '#0066FF',
          barPercentage: 0.5,
          categoryPercentage: 0.7,
        },
        {
          label: 'Pendentes',
          data: pendingValues,
          backgroundColor: '#F97316',
          barPercentage: 0.5,
          categoryPercentage: 0.7,
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
              x: {
                stacked: false
              },
              y: {
                stacked: false,
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }}
        />
      )}
    </ChartCard>
  );
};

export default DepartmentComparisonChart;
