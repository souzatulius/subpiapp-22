
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface AttentionPointsChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const AttentionPointsChart: React.FC<AttentionPointsChartProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate attention points chart data
  const generateAttentionPointsData = React.useMemo(() => {
    const issueTypes = [
      'Protocolo sem resposta', 
      'Cadastrado errado', 
      'Fora da jurisdição',
      'Responsável externo',
      'Não categorizado'
    ];
    
    // Values representing number of OS with issues
    let values = [42, 35, 28, 22, 18];
    
    if (isSimulationActive) {
      // In simulation, these would be reduced
      values = values.map(val => Math.round(val * 0.6));
    }
    
    return {
      labels: issueTypes,
      datasets: [
        {
          label: 'Quantidade',
          data: values,
          backgroundColor: [
            '#F97316', // Orange for most critical
            '#EA580C', // Dark orange
            '#FB923C', // Light orange
            '#0066FF', // Blue
            '#64748B'  // Gray
          ],
          barPercentage: 0.7,
        }
      ]
    };
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Pontos de Atenção"
      subtitle="Avaliação de problemas com registro no Portal 156"
      value="Onde estamos parados"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar
          data={generateAttentionPointsData}
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
                    return `${context.parsed.x} ordens de serviço`;
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Quantidade de OS'
                }
              }
            }
          }}
        />
      )}
    </ChartCard>
  );
};

export default AttentionPointsChart;
