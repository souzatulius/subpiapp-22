
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

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
  const [chartData, setChartData] = React.useState<any>({
    labels: [],
    datasets: []
  });
  
  React.useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      // Group data by technical department
      const departments = ['STLP', 'STM', 'STPO']; // Add other departments if needed
      const statusCategories = ['Fechada', 'Pendente', 'Cancelada'];
      
      // Initialize data structure
      const deptData: Record<string, Record<string, number>> = {};
      departments.forEach(dept => {
        deptData[dept] = {
          Fechada: 0,
          Pendente: 0,
          Cancelada: 0,
          Total: 0
        };
      });
      
      // Count orders by department and status
      sgzData.forEach((order: any) => {
        const dept = order.sgz_departamento_tecnico || 'Outro';
        if (!departments.includes(dept)) return;
        
        const status = order.sgz_status?.toLowerCase() || '';
        let statusCategory;
        
        if (status.includes('fecha') || status.includes('conclu')) {
          statusCategory = 'Fechada';
        } else if (status.includes('cancel')) {
          statusCategory = 'Cancelada';
        } else {
          statusCategory = 'Pendente';
        }
        
        deptData[dept][statusCategory] += 1;
        deptData[dept].Total += 1;
      });
      
      // Apply simulation if active
      if (isSimulationActive) {
        departments.forEach(dept => {
          // In simulation: move some pending to closed, some canceled to closed
          const pendingToClose = Math.round(deptData[dept].Pendente * 0.3); // 30% of pending become closed
          const canceledToClose = Math.round(deptData[dept].Cancelada * 0.2); // 20% of canceled become closed
          
          deptData[dept].Fechada += pendingToClose + canceledToClose;
          deptData[dept].Pendente -= pendingToClose;
          deptData[dept].Cancelada -= canceledToClose;
        });
      }
      
      // Prepare chart data
      setChartData({
        labels: departments,
        datasets: statusCategories.map((status, index) => ({
          label: status,
          data: departments.map(dept => deptData[dept][status]),
          backgroundColor: 
            status === 'Fechada' ? 'rgba(34, 197, 94, 0.8)' : // Green for closed
            status === 'Pendente' ? 'rgba(249, 115, 22, 0.8)' : // Orange for pending
            'rgba(239, 68, 68, 0.8)', // Red for canceled
          borderColor:
            status === 'Fechada' ? 'rgba(34, 197, 94, 1)' :
            status === 'Pendente' ? 'rgba(249, 115, 22, 1)' :
            'rgba(239, 68, 68, 1)',
          borderWidth: 1
        }))
      });
    }
  }, [sgzData, isSimulationActive]);
  
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
            const value = context.parsed.y || 0;
            const datasetIndex = context.datasetIndex;
            const label = context.dataset.label;
            
            // Calculate percentage
            const totalForDept = sgzData
              ?.filter(o => o.sgz_departamento_tecnico === context.label)
              .length || 0;
            
            const percentage = totalForDept > 0 
              ? ((value / totalForDept) * 100).toFixed(1) + '%'
              : '0%';
            
            return `${label}: ${value} (${percentage})`;
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
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        stacked: true,
        ticks: {
          font: { size: 10 }
        },
        beginAtZero: true
      }
    }
  };
  
  // Department acronym meanings for card value
  const deptMeanings = {
    'STLP': 'Supervisão Técnica de Limpeza Pública',
    'STM': 'Supervisão Técnica de Manutenção',
    'STPO': 'Supervisão Técnica de Projetos e Obras'
  };
  
  const cardValue = isSimulationActive ? 'Simulação Ativa' : 'Comparativo por Departamento';
  
  return (
    <ChartCard
      title="Comparação STLP / STM / STPO"
      value={cardValue}
      isLoading={isLoading}
    >
      {chartData.labels.length > 0 && (
        <Bar data={chartData} options={chartOptions} />
      )}
    </ChartCard>
  );
};

export default DepartmentComparisonChart;
