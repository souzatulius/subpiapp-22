
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
    // Create data for internal vs external responsibility
    let values = [60, 40]; // Base value: 60% subprefeitura, 40% external
    const labels = ['Subprefeitura', 'Órgãos Externos'];
    
    if (isSimulationActive) {
      // In simulation, show proper categorization with less external ones
      values = [80, 20];
    }
    
    return {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#0066FF', // Subprefeitura (blue)
            '#F97316'  // External (orange)
          ],
          borderColor: [
            '#FFFFFF',
            '#FFFFFF'
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [isSimulationActive]);
  
  // Generate external data breakdown
  const generateExternalBreakdownData = React.useMemo(() => {
    const companies = ['Enel', 'Sabesp', 'Comgás', 'Outros'];
    const values = isSimulationActive ? [40, 30, 20, 10] : [50, 40, 5, 5];
    
    return {
      labels: companies,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#F97316', // Enel (Orange)
            '#EA580C', // Sabesp (Dark Orange)
            '#FB923C', // Comgás (Light Orange)
            '#64748B'  // Others (Gray)
          ],
          borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
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
        <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-2">
          <div>
            <h4 className="text-xs font-medium text-center text-gray-500 mb-1">Responsabilidade</h4>
            <Pie 
              data={generateResponsibilityData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      boxWidth: 12,
                      boxHeight: 12,
                      font: {
                        size: 10
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const percentage = value + '%';
                        return `${label}: ${percentage}`;
                      }
                    }
                  },
                  datalabels: {
                    formatter: (value: number) => {
                      return value + '%';
                    },
                    color: '#fff',
                    font: {
                      weight: 'bold'
                    }
                  }
                }
              }}
            />
          </div>
          <div>
            <h4 className="text-xs font-medium text-center text-gray-500 mb-1">Detalhamento Externo</h4>
            <Pie 
              data={generateExternalBreakdownData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      boxWidth: 12,
                      boxHeight: 12,
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </ChartCard>
  );
};

export default ResponsibilityChart;
