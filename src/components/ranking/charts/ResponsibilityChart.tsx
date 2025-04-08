
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ResponsibilityChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ResponsibilityChart: React.FC<ResponsibilityChartProps> = ({ 
  data, 
  sgzData, 
  painelData,
  isLoading,
  isSimulationActive 
}) => {
  // Generate responsibility chart data
  const generateResponsibilityData = React.useMemo(() => {
    // Categories of responsibility
    const categories = [
      'Subprefeitura', 
      'Enel', 
      'Sabesp', 
      'SPTrans', 
      'Outros'
    ];
    
    // Generate percentages
    let percentages = [65, 14, 8, 6, 7];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Increase subprefeitura percentage in simulation
      percentages = [72, 12, 7, 5, 4];
    }
    
    return {
      labels: categories,
      datasets: [
        {
          data: percentages,
          backgroundColor: [
            '#0066FF', // Blue for Subprefeitura
            '#F97316', // Orange for Enel
            '#1E40AF', // Dark Blue for Sabesp
            '#EA580C', // Dark Orange for SPTrans
            '#64748B'  // Gray for Outros
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
      title="Gargalos e Problemas"
      subtitle="Quem impacta nosso ranking"
      value="20% Enel e Sabesp"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Pie 
          data={generateResponsibilityData} 
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

export default ResponsibilityChart;
