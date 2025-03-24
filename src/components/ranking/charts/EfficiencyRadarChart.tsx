
import React from 'react';
import { Radar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface EfficiencyRadarChartProps {
  data: any;
  isLoading: boolean;
}

const EfficiencyRadarChart: React.FC<EfficiencyRadarChartProps> = ({ data, isLoading }) => {
  // Calculate an efficiency score as the average of all metrics
  const efficiencyScore = !isLoading && data && data.datasets && data.datasets[0]?.data
    ? Math.round(data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0) / (data.datasets[0].data.length || 1))
    : 0;
  
  return (
    <ChartCard
      title="Radar de Eficiência por Área Técnica"
      value={isLoading ? '' : `Score: ${efficiencyScore}/100`}
      isLoading={isLoading}
    >
      {!isLoading && data && (
        <Radar 
          data={data} 
          options={{
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 20
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default EfficiencyRadarChart;
