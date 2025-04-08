
import React from 'react';
import { Bar } from 'react-chartjs-2';
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
    // Use the new district names as requested
    const districts = [
      'Nossa Sub - Pinheiros',
      'Sub Vizinha - Lapa',
      'Sub Interior - Sé',
      'Sub Litoral - Butantã',
      'Outras'
    ];
    
    // Generate percentage values for each district
    let percentages = [0.8, 0.7, 0.5, 0.3, 0.2];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Improved efficiency in simulation
      percentages = percentages.map(p => Math.min(p + 0.15, 1));
    }
    
    // Format for display
    const values = percentages.map(p => (p * 100).toFixed(1));
    
    return {
      labels: districts,
      datasets: [
        {
          label: 'Impacto %',
          data: values,
          backgroundColor: [
            '#0066FF', // Nossa Sub (Pinheiros)
            '#1E40AF', // Sub Vizinha (Lapa)
            '#F97316', // Sub Interior (Sé)
            '#EA580C', // Sub Litoral (Butantã)
            '#64748B'  // Outras
          ],
          barPercentage: 0.6,
        }
      ]
    };
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Distritos incluídos indevidamente"
      subtitle="Outras subs na planilha"
      value="Estão impactando negativamente 2,3%"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar
          data={generateDistrictPerformanceData}
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
                    return `Impacto: ${context.parsed.x}%`;
                  }
                }
              }
            },
            scales: {
              x: {
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

export default DistrictPerformanceChart;
