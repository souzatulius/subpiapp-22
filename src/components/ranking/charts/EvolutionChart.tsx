
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

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
  // Process data to get evolution of demands over time
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    
    // Initialize data structure
    const months = Array(12).fill(0).map((_, i) => ({
      month: i,
      label: monthLabels[i],
      created: 0,
      completed: 0,
      pending: 0
    }));
    
    // Process each order by month
    sgzData.forEach(order => {
      try {
        const createdDate = order.sgz_criado_em ? new Date(order.sgz_criado_em) : null;
        const completedDate = (order.sgz_status === 'concluido' && order.sgz_modificado_em) 
          ? new Date(order.sgz_modificado_em) 
          : null;
        
        if (createdDate && createdDate.getFullYear() === currentYear) {
          const monthIndex = createdDate.getMonth();
          months[monthIndex].created++;
        }
        
        if (completedDate && completedDate.getFullYear() === currentYear) {
          const monthIndex = completedDate.getMonth();
          months[monthIndex].completed++;
        }
      } catch (error) {
        console.error('Error processing date:', error);
      }
    });
    
    // Calculate pending (cumulative)
    let pendingCount = 0;
    months.forEach(month => {
      pendingCount += (month.created - month.completed);
      month.pending = pendingCount;
    });
    
    return months;
  }, [sgzData]);
  
  // Prepare line chart data
  const lineChartData = React.useMemo(() => {
    if (!chartData) return null;
    
    // Apply simulation factor if active
    const simulationFactorCreated = isSimulationActive ? 1.1 : 1;
    const simulationFactorCompleted = isSimulationActive ? 1.3 : 1;
    
    const currentMonth = new Date().getMonth();
    const filteredData = chartData.filter(month => month.month <= currentMonth);
    
    return {
      labels: filteredData.map(d => d.label),
      datasets: [
        {
          label: 'Criadas',
          data: filteredData.map(d => Math.round(d.created * simulationFactorCreated)),
          borderColor: chartColors[0],
          backgroundColor: `${chartColors[0]}20`,
          tension: 0.4,
          fill: false
        },
        {
          label: 'Concluídas',
          data: filteredData.map(d => Math.round(d.completed * simulationFactorCompleted)),
          borderColor: chartColors[1],
          backgroundColor: `${chartColors[1]}20`,
          tension: 0.4,
          fill: false
        },
        {
          label: 'Pendentes (Acumulado)',
          data: filteredData.map((d, i) => {
            const created = Math.round(d.created * simulationFactorCreated);
            const completed = Math.round(d.completed * simulationFactorCompleted);
            
            if (i === 0) return created - completed;
            
            const prevPending = filteredData[i-1].pending;
            return prevPending + (created - completed);
          }),
          borderColor: chartColors[2],
          backgroundColor: `${chartColors[2]}20`,
          tension: 0.4,
          fill: false
        }
      ]
    };
  }, [chartData, isSimulationActive]);
  
  // Chart options
  const options = {
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
        title: {
          display: true,
          text: 'Quantidade'
        }
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Sem dados disponíveis para exibir
      </div>
    );
  }
  
  return (
    <div className="h-64">
      {lineChartData && <Line data={lineChartData} options={options} />}
    </div>
  );
};

export default EvolutionChart;
