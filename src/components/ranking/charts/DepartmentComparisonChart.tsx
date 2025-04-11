
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

interface DepartmentData {
  name: string;
  efficiency: number;
  total: number;
  completed: number;
}

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
  // Process data for department comparison
  const departmentData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return [];
    
    // Count by department
    const deptMap = new Map<string, DepartmentData>();
    
    sgzData.forEach(order => {
      const dept = order.sgz_area_tecnica || order.sgz_coordenacao || 'Não informado';
      const isCompleted = order.sgz_status === 'concluido' || order.sgz_status === 'concluído';
      
      if (!deptMap.has(dept)) {
        deptMap.set(dept, {
          name: dept,
          efficiency: 0,
          total: 0,
          completed: 0
        });
      }
      
      const deptData = deptMap.get(dept);
      if (deptData) {
        deptData.total += 1;
        if (isCompleted) {
          deptData.completed += 1;
        }
        // Update efficiency - percentage of completed orders
        deptData.efficiency = deptData.completed / deptData.total * 100;
      }
    });
    
    // Convert to array and sort by efficiency
    const departments: DepartmentData[] = Array.from(deptMap.values())
      .filter(d => d.total > 10) // Only show departments with enough data
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 5); // Show top 5 departments
    
    return departments;
  }, [sgzData]);
  
  // Prepare chart data
  const barChartData = useMemo(() => {
    if (!departmentData || departmentData.length === 0) return null;
    
    // Apply simulation factor if active
    const simulationFactor = isSimulationActive ? 1.15 : 1;
    
    return {
      labels: departmentData.map(d => d.name),
      datasets: [
        {
          label: 'Eficiência (%)',
          data: departmentData.map(d => isSimulationActive 
            ? Math.min(d.efficiency * simulationFactor, 100) 
            : d.efficiency
          ),
          backgroundColor: chartColors[0],
          borderColor: chartColors[0],
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        },
        {
          label: 'Total de Ordens',
          data: departmentData.map(d => d.total),
          backgroundColor: chartColors[2],
          borderColor: chartColors[2],
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
          yAxisID: 'y1'
        }
      ]
    };
  }, [departmentData, isSimulationActive]);
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return context.dataset.label === 'Eficiência (%)' 
              ? `${context.dataset.label}: ${value.toFixed(1)}%`
              : `${context.dataset.label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Eficiência (%)'
        },
        suggestedMax: 100
      },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Total de Ordens'
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
  
  if (!departmentData || departmentData.length === 0) {
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
