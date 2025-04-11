
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

interface TimeComparisonChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const TimeComparisonChart: React.FC<TimeComparisonChartProps> = ({
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
    labels: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5'],
    datasets: [{
      label: 'Dias',
      data: [12, 19, 8, 15, 7],
      backgroundColor: chartColors[1]
    }]
  };
  
  return (
    <div className="h-64">
      <Bar 
        data={sampleData} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }} 
      />
    </div>
  );
};

export default TimeComparisonChart;
