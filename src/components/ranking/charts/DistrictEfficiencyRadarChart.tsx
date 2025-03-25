
import React from 'react';
import { Radar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DistrictEfficiencyRadarChartProps {
  data: any;
  isLoading: boolean;
}

const DistrictEfficiencyRadarChart: React.FC<DistrictEfficiencyRadarChartProps> = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="Radar de eficiência por distrito"
      value={isLoading ? '' : 'Análise comparativa'}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Radar
          data={data} 
          options={{
            maintainAspectRatio: false,
            scales: {
              r: {
                beginAtZero: true,
                min: 0,
                suggestedMax: 10,
              }
            },
            plugins: {
              legend: {
                position: 'right' as const,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.r;
                    const index = context.dataIndex;
                    const metric = data.labels[index];
                    return `${label}: ${metric} - ${value}`;
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

export default DistrictEfficiencyRadarChart;
