
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';
import InsufficientDataMessage from './InsufficientDataMessage';

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
  // Process data to get service evolution over time
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Get unique dates and sort them
    const datesMap = new Map<string, { opened: number, closed: number }>();
    
    sgzData.forEach(order => {
      // Use date strings in YYYY-MM-DD format
      const createdDate = order.sgz_criado_em ? 
        new Date(order.sgz_criado_em).toISOString().split('T')[0] : null;
      
      const status = order.sgz_status?.toLowerCase() || '';
      const isCompleted = status.includes('conclu') || status.includes('finaliz');
      
      if (createdDate) {
        if (!datesMap.has(createdDate)) {
          datesMap.set(createdDate, { opened: 0, closed: 0 });
        }
        
        datesMap.get(createdDate)!.opened += 1;
        
        if (isCompleted) {
          datesMap.get(createdDate)!.closed += 1;
        }
      }
    });
    
    // Sort dates and prepare data for chart
    const sortedDates = Array.from(datesMap.keys()).sort();
    
    // We need at least 3 points for a meaningful line chart
    if (sortedDates.length < 3) return null;
    
    // Group by week if we have more than 30 days
    const shouldGroupByWeek = sortedDates.length > 30;
    
    const labels: string[] = [];
    const openedData: number[] = [];
    const closedData: number[] = [];
    
    if (shouldGroupByWeek) {
      // Group by week (simple approach - group every 7 days)
      for (let i = 0; i < sortedDates.length; i += 7) {
        const weekDates = sortedDates.slice(i, i + 7);
        const weekLabel = `${weekDates[0]} - ${weekDates[weekDates.length - 1] || weekDates[0]}`;
        
        labels.push(weekLabel);
        
        const weekOpened = weekDates.reduce((sum, date) => {
          return sum + (datesMap.get(date)?.opened || 0);
        }, 0);
        
        const weekClosed = weekDates.reduce((sum, date) => {
          return sum + (datesMap.get(date)?.closed || 0);
        }, 0);
        
        openedData.push(weekOpened);
        closedData.push(weekClosed);
      }
    } else {
      // Use daily data
      sortedDates.forEach(date => {
        const dateStats = datesMap.get(date)!;
        
        labels.push(date);
        openedData.push(dateStats.opened);
        closedData.push(dateStats.closed);
      });
    }
    
    return { labels, openedData, closedData };
  }, [sgzData]);
  
  // Apply simulation effects if active
  const simulatedData = React.useMemo(() => {
    if (!chartData) return null;
    
    if (isSimulationActive) {
      // In simulation mode, we want to show improved metrics
      return {
        ...chartData,
        closedData: chartData.closedData.map((value: number) => 
          Math.min(value * 1.25, value + 10) // 25% improvement, max 10 additional closures
        )
      };
    }
    
    return chartData;
  }, [chartData, isSimulationActive]);
  
  // Prepare line chart data
  const lineData = React.useMemo(() => {
    if (!simulatedData) return null;
    
    return {
      labels: simulatedData.labels,
      datasets: [
        {
          label: 'Ordens Abertas',
          data: simulatedData.openedData,
          borderColor: chartColors[0],
          backgroundColor: `${chartColors[0]}20`,
          tension: 0.3
        },
        {
          label: 'Ordens Concluídas',
          data: simulatedData.closedData,
          borderColor: chartColors[2],
          backgroundColor: `${chartColors[2]}20`,
          tension: 0.3
        }
      ]
    };
  }, [simulatedData]);
  
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
  
  if (!chartData || !lineData) {
    return (
      <div className="h-64">
        <InsufficientDataMessage message="Dados insuficientes para mostrar evolução dos serviços" />
      </div>
    );
  }
  
  return (
    <div className="h-64">
      {lineData && <Line data={lineData} options={options} />}
    </div>
  );
};

export default EvolutionChart;
