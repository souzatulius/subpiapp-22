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
  const [chartData, setChartData] = React.useState<any>({
    labels: [],
    datasets: []
  });
  
  React.useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      // Group SGZ data by date
      const groupedByDate = sgzData.reduce((acc: any, order: any) => {
        // Format date - extract just the date part
        const date = new Date(order.sgz_criado_em).toISOString().split('T')[0];
        
        if (!acc[date]) {
          acc[date] = {
            total: 0,
            fechadas: 0,
            pendentes: 0,
            canceladas: 0
          };
        }
        
        acc[date].total += 1;
        
        // Count by status - adjust if your status values are different
        const status = order.sgz_status?.toLowerCase();
        if (status?.includes('fecha') || status?.includes('conclu')) {
          acc[date].fechadas += 1;
        } else if (status?.includes('cancel')) {
          acc[date].canceladas += 1;
        } else {
          acc[date].pendentes += 1;
        }
        
        return acc;
      }, {});
      
      // Sort dates
      const sortedDates = Object.keys(groupedByDate).sort();
      
      // Calculate percentages
      const percentages = sortedDates.map(date => {
        const { total, fechadas, pendentes, canceladas } = groupedByDate[date];
        return {
          date,
          fechadas: (fechadas / total) * 100,
          pendentes: (pendentes / total) * 100,
          canceladas: (canceladas / total) * 100
        };
      });
      
      // Apply simulation if active
      const simulatedData = isSimulationActive 
        ? percentages.map(dayData => {
            // In the ideal scenario:
            // - External orders are canceled
            // - All CONC orders are closed
            // This is a simplified simulation - you'd want to implement the actual logic
            // based on the real criteria for your "ideal ranking"
            return {
              ...dayData,
              fechadas: Math.min(dayData.fechadas + 15, 100), // Increase closed by 15%
              pendentes: Math.max(dayData.pendentes - 10, 0), // Decrease pending by 10%
              canceladas: Math.max(dayData.canceladas - 5, 0)  // Decrease canceled by 5%
            };
          })
        : percentages;
      
      setChartData({
        labels: simulatedData.map(day => day.date),
        datasets: [
          {
            label: '% Fechadas',
            data: simulatedData.map(day => day.fechadas.toFixed(1)),
            borderColor: '#22c55e', // Green
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.3,
            fill: false
          },
          {
            label: '% Pendentes',
            data: simulatedData.map(day => day.pendentes.toFixed(1)),
            borderColor: '#f97316', // Orange
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.3,
            fill: false
          },
          {
            label: '% Canceladas',
            data: simulatedData.map(day => day.canceladas.toFixed(1)),
            borderColor: '#ef4444', // Red
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.3,
            fill: false
          }
        ]
      });
    }
  }, [sgzData, painelData, isSimulationActive]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 10 },
          callback: function(value: any) {
            return value + '%';
          }
        },
        min: 0,
        max: 100
      }
    }
  };
  
  return (
    <ChartCard
      title="Evolução % Status (Dia/Semana)"
      value={isSimulationActive ? "Simulação Ativa" : "Dados Reais"}
      isLoading={isLoading}
    >
      {chartData.labels.length > 0 && (
        <Line data={chartData} options={chartOptions} />
      )}
    </ChartCard>
  );
};

export default EvolutionChart;
