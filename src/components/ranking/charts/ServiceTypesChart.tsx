
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceTypesChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate service types chart data
  const generateServiceTypesData = React.useMemo(() => {
    const services = [
      'Poda de Árvores', 
      'Tapa-buraco', 
      'Limpeza de Bueiros', 
      'Reparo de Iluminação',
      'Coleta de Lixo'
    ];
    
    // Generate random values
    let values = [35, 22, 18, 15, 10];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // More balanced distribution in simulation
      values = [30, 25, 20, 15, 10];
    }
    
    return {
      labels: services,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#F97316', // Orange
            '#0066FF', // Blue
            '#1E40AF', // Dark Blue
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
      title="Distribuição por Serviço"
      subtitle="Problemas mais frequentes das demandas"
      value="Poda de Árvores é a principal queixa"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Pie 
          data={generateServiceTypesData} 
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
              }
            }
          }}
        />
      )}
    </ChartCard>
  );
};

export default ServiceTypesChart;
