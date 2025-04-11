
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

interface StatusTransitionChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const StatusTransitionChart: React.FC<StatusTransitionChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive
}) => {
  // Basic implementation for now
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }
  
  if (!sgzData || sgzData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Sem dados disponíveis para exibir
      </div>
    );
  }
  
  // Sample data for now
  const sampleData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Aberto',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: chartColors[0],
        backgroundColor: `${chartColors[0]}20`,
        tension: 0.4
      },
      {
        label: 'Em Andamento',
        data: [5, 15, 10, 12, 15, 10],
        borderColor: chartColors[1],
        backgroundColor: `${chartColors[1]}20`,
        tension: 0.4
      },
      {
        label: 'Concluído',
        data: [2, 8, 12, 5, 10, 15],
        borderColor: chartColors[2],
        backgroundColor: `${chartColors[2]}20`,
        tension: 0.4
      }
    ]
  };
  
  return (
    <div className="h-64">
      <Line 
        data={sampleData} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }} 
      />
    </div>
  );
};

export default StatusTransitionChart;
