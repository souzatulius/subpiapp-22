
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface TimeComparisonChartProps {
  data: any;
  isLoading: boolean;
}

const TimeComparisonChart: React.FC<TimeComparisonChartProps> = ({ data, isLoading }) => {
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
  
  return (
    <ChartCard
      title="Comparativo de tempo médio"
      value={isLoading ? '' : 'Comparação'}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar 
          data={safeData} 
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
  );
};

export default TimeComparisonChart;
