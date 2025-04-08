
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface EvolutionChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const EvolutionChart: React.FC<EvolutionChartProps> = ({ 
  data, 
  sgzData, 
  painelData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate evolution chart data
  const generateEvolutionData = React.useMemo(() => {
    // Generate 7 days of data for the past week
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }
    
    // Base values for evolution over time
    let fechadas = [68, 66, 72, 70, 75, 78, 82];
    let pendentes = [22, 24, 18, 20, 15, 14, 12];
    let canceladas = [10, 10, 10, 10, 10, 8, 6];
    
    // Apply simulation effects if active
    if (isSimulationActive) {
      // Improved closed rates in simulation
      fechadas = fechadas.map(val => Math.min(val + 10, 100));
      // Reduced pending in simulation
      pendentes = pendentes.map(val => Math.max(val - 6, 0));
      // Reduced canceled in simulation
      canceladas = canceladas.map(val => Math.max(val - 3, 0));
    }
    
    return {
      labels: days,
      datasets: [
        {
          label: 'Fechadas',
          data: fechadas,
          borderColor: '#0066FF',
          backgroundColor: 'rgba(0, 102, 255, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Pendentes',
          data: pendentes,
          borderColor: '#F97316',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Canceladas',
          data: canceladas,
          borderColor: '#64748B',
          backgroundColor: 'rgba(100, 116, 139, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Serviços em Andamento"
      subtitle="Evolução dos status de serviços na semana"
      value="25,0% mais eficiente nesta semana"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Line 
          data={generateEvolutionData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              }
            },
            scales: {
              y: {
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

export default EvolutionChart;
