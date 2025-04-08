
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { TrendingDown } from 'lucide-react';

interface ResolutionTimeChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate resolution time chart data
  const generateResolutionTimeData = React.useMemo(() => {
    const services = [
      'Tapa-buraco', 
      'Poda de Árvores', 
      'Iluminação',
      'Bueiros',
      'Coleta de Lixo'
    ];
    
    // Generate resolution time days
    let days = [16.8, 14.2, 12.5, 10.3, 7.9];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Reduce resolution times in simulation by ~30%
      days = days.map(day => day * 0.7);
    }
    
    return {
      labels: services,
      datasets: [
        {
          label: 'Dias',
          data: days,
          backgroundColor: '#0066FF',
          barPercentage: 0.6,
        }
      ]
    };
  }, [isSimulationActive]);
  
  const trendIndicator = (
    <div className="flex items-center gap-1 text-xs text-red-500">
      <span className="font-medium">pior 3%</span>
      <TrendingDown className="h-3 w-3" />
    </div>
  );
  
  return (
    <ChartCard
      title="Prazo de Execução"
      subtitle="Tempo médio até fechamento das OS"
      value="13,9 dias"
      isLoading={isLoading}
      trendIndicator={trendIndicator}
    >
      {!isLoading && (
        <Bar
          data={generateResolutionTimeData}
          options={{
            indexAxis: 'y' as const,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.parsed.x.toFixed(1)} dias`;
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value + ' dias';
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

export default ResolutionTimeChart;
