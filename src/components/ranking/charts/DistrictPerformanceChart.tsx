
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DistrictPerformanceChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const DistrictPerformanceChart: React.FC<DistrictPerformanceChartProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate district performance chart data
  const generateDistrictPerformanceData = React.useMemo(() => {
    const districts = [
      'Nossa Sub', 
      'Sub Vizinha', 
      'Sub Interior', 
      'Sub Litoral',
      'Outras'
    ];
    
    // Generate percentages for districts
    let percentages = [97.7, 0.8, 0.6, 0.4, 0.5];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Even higher percentage for correct sub in simulation
      percentages = [99.2, 0.3, 0.2, 0.2, 0.1];
    }
    
    return {
      labels: districts,
      datasets: [
        {
          data: percentages,
          backgroundColor: [
            '#0066FF', // Blue (for "Nossa Sub")
            '#F97316', // Orange
            '#EA580C', // Dark Orange
            '#64748B', // Gray
            '#94A3B8'  // Light Gray
          ],
          borderColor: [
            '#FFFFFF',
            '#FFFFFF',
            '#FFFFFF',
            '#FFFFFF',
            '#FFFFFF'
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Distritos incluídos indevidamente"
      subtitle="Outras subs na planilha"
      value="Impactam - 2,3%"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Pie 
          data={generateDistrictPerformanceData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right' as const,
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
                    return `${context.label}: ${context.parsed}%`;
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

export default DistrictPerformanceChart;
