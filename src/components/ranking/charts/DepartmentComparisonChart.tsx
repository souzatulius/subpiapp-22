
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { chartTheme } from './ChartRegistration';

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
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Agrupar por departamento técnico
    const departments = {
      'STLP': { total: 0, concluido: 0, pendente: 0, cancelado: 0 },
      'STM': { total: 0, concluido: 0, pendente: 0, cancelado: 0 },
      'STPO': { total: 0, concluido: 0, pendente: 0, cancelado: 0 }
    };
    
    sgzData.forEach(order => {
      const dept = order.sgz_departamento_tecnico || 'Não informado';
      if (!departments[dept]) {
        departments[dept] = { total: 0, concluido: 0, pendente: 0, cancelado: 0 };
      }
      
      departments[dept].total++;
      
      const status = (order.sgz_status || '').toUpperCase();
      if (status.includes('CONC') || status.includes('FECHA')) {
        departments[dept].concluido++;
      } else if (status.includes('CANC')) {
        departments[dept].cancelado++;
      } else {
        departments[dept].pendente++;
      }
    });
    
    // Aplicar simulação se ativa
    if (isSimulationActive) {
      Object.values(departments).forEach(dept => {
        // Em um cenário ideal, reduzimos pendências e aumentamos conclusões
        const pendentesReducao = Math.floor(dept.pendente * 0.3); // 30% das pendências viram concluídas
        dept.concluido += pendentesReducao;
        dept.pendente -= pendentesReducao;
      });
    }
    
    return {
      labels: Object.keys(departments),
      datasets: [
        {
          label: 'Concluídas',
          data: Object.values(departments).map(d => d.concluido),
          backgroundColor: '#22c55e', // green-500
        },
        {
          label: 'Pendentes',
          data: Object.values(departments).map(d => d.pendente),
          backgroundColor: '#f97316', // orange-500
        },
        {
          label: 'Canceladas',
          data: Object.values(departments).map(d => d.cancelado),
          backgroundColor: '#ef4444', // red-500
        }
      ]
    };
  }, [sgzData, isSimulationActive]);
  
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
            return `${context.dataset.label}: ${context.raw} OS`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      }
    }
  };
  
  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return '0 OS';
    
    const departments: Record<string, number> = {};
    
    sgzData.forEach(order => {
      const dept = order.sgz_departamento_tecnico || 'Não informado';
      if (!departments[dept]) {
        departments[dept] = 0;
      }
      departments[dept]++;
    });
    
    // Ordenar departamentos por volume
    const sortedDepts = Object.entries(departments).sort((a, b) => b[1] - a[1]);
    
    if (sortedDepts.length > 0) {
      return `${sortedDepts[0][0]}: ${sortedDepts[0][1]} OS`;
    }
    
    return '0 OS';
  }, [sgzData]);

  return (
    <ChartCard
      title="Comparação por Departamento"
      value={stats}
      isLoading={isLoading}
    >
      {chartData && (
        <Bar data={chartData} options={options} />
      )}
    </ChartCard>
  );
};

export default DepartmentComparisonChart;
