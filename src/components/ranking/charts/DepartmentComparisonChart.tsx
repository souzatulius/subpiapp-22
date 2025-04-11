
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

interface DepartmentComparisonChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const DepartmentComparisonChart: React.FC<DepartmentComparisonChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive
}) => {
  // Process data to compare departments
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Group by department and status
    const deptStats = {};
    
    sgzData.forEach(order => {
      const department = order.sgz_coordenacao || order.sgz_area_tecnica || 'Não informado';
      const status = order.sgz_status || 'Não informado';
      
      if (!deptStats[department]) {
        deptStats[department] = {
          name: department,
          total: 0,
          completed: 0,
          pending: 0,
          inProgress: 0
        };
      }
      
      deptStats[department].total += 1;
      
      if (status === 'concluido') {
        deptStats[department].completed += 1;
      } else if (status === 'pendente') {
        deptStats[department].pending += 1;
      } else if (status === 'em-andamento') {
        deptStats[department].inProgress += 1;
      }
    });
    
    // Calculate efficiency
    Object.values(deptStats).forEach(dept => {
      dept.efficiency = dept.total > 0 ? (dept.completed / dept.total) * 100 : 0;
    });
    
    // Sort by efficiency
    return Object.values(deptStats)
      .sort((a: any, b: any) => b.efficiency - a.efficiency)
      .slice(0, 5); // Top 5 departments
  }, [sgzData]);
  
  // Prepare bar chart data
  const barChartData = React.useMemo(() => {
    if (!chartData) return null;
    
    // Apply simulation effect if enabled
    const simulationFactor = isSimulationActive ? 1.15 : 1;
    
    return {
      labels: chartData.map(d => d.name),
      datasets: [
        {
          label: 'Eficiência (%)',
          data: chartData.map(d => isSimulationActive 
            ? Math.min(100, d.efficiency * simulationFactor) 
            : d.efficiency
          ),
          backgroundColor: chartColors[4],
          borderColor: chartColors[4],
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Total de Demandas',
          data: chartData.map(d => d.total),
          backgroundColor: chartColors[5],
          borderColor: chartColors[5],
          borderWidth: 1,
          yAxisID: 'y1'
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
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return context.datasetIndex === 0
              ? `${label}: ${value.toFixed(1)}%`
              : `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Eficiência (%)'
        },
        min: 0,
        max: 100
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Total de Demandas'
        },
        grid: {
          drawOnChartArea: false,
        },
        beginAtZero: true
      },
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
      {barChartData && <Bar data={barChartData} options={options} />}
    </div>
  );
};

export default DepartmentComparisonChart;
