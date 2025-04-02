
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { chartTheme } from './ChartRegistration';
import { format, parseISO, isValid, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;

    // Função para ordenar e agrupar por data
    const groupByDate = (data: any[], dateField: string) => {
      const today = new Date();
      const lastWeek = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        return format(date, 'yyyy-MM-dd');
      });
      
      const result: Record<string, { total: number, concluido: number, pendente: number, cancelado: number }> = {};
      
      // Inicializar todos os dias da última semana
      lastWeek.forEach(date => {
        result[date] = { total: 0, concluido: 0, pendente: 0, cancelado: 0 };
      });
      
      // Agrupar os dados
      data.forEach(item => {
        if (!item[dateField]) return;
        
        let dateStr;
        try {
          const date = parseISO(item[dateField]);
          if (!isValid(date)) return;
          dateStr = format(date, 'yyyy-MM-dd');
          
          // Verificar se está na última semana
          if (!lastWeek.includes(dateStr)) return;
          
          if (!result[dateStr]) {
            result[dateStr] = { total: 0, concluido: 0, pendente: 0, cancelado: 0 };
          }
          
          result[dateStr].total += 1;
          
          const status = (item.sgz_status || '').toUpperCase();
          if (status.includes('CONC') || status.includes('FECHA')) {
            result[dateStr].concluido += 1;
          } else if (status.includes('CANC')) {
            result[dateStr].cancelado += 1;
          } else {
            result[dateStr].pendente += 1;
          }
        } catch (error) {
          console.error('Error parsing date:', error);
          return;
        }
      });
      
      return result;
    };
    
    const dailyData = groupByDate(sgzData, 'sgz_modificado_em');
    
    // Aplicar simulação se ativa
    if (isSimulationActive) {
      Object.values(dailyData).forEach(dayStats => {
        // Em um cenário ideal, reduzimos pendências e cancelamentos e aumentamos conclusões
        const pendentesReducao = Math.floor(dayStats.pendente * 0.2); // 20% das pendências viram concluídas
        const canceladasReducao = Math.floor(dayStats.cancelado * 0.3); // 30% das canceladas viram concluídas
        
        dayStats.concluido += pendentesReducao + canceladasReducao;
        dayStats.pendente -= pendentesReducao;
        dayStats.cancelado -= canceladasReducao;
      });
    }
    
    // Formatar dados para o gráfico
    const dates = Object.keys(dailyData).sort();
    const concluidoPct = dates.map(date => {
      const day = dailyData[date];
      return day.total > 0 ? (day.concluido / day.total * 100).toFixed(1) : "0";
    });
    
    const pendentePct = dates.map(date => {
      const day = dailyData[date];
      return day.total > 0 ? (day.pendente / day.total * 100).toFixed(1) : "0";
    });
    
    const canceladoPct = dates.map(date => {
      const day = dailyData[date];
      return day.total > 0 ? (day.cancelado / day.total * 100).toFixed(1) : "0";
    });
    
    return {
      labels: dates.map(date => {
        try {
          return format(parseISO(date), 'dd/MM', { locale: ptBR });
        } catch {
          return date;
        }
      }),
      datasets: [
        {
          label: 'Concluídas',
          data: concluidoPct,
          borderColor: '#22c55e', // green-500
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Pendentes',
          data: pendentePct,
          borderColor: '#f97316', // orange-500
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Canceladas',
          data: canceladoPct,
          borderColor: '#ef4444', // red-500
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  }, [sgzData, painelData, isSimulationActive]);
  
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
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Porcentagem'
        }
      }
    }
  };
  
  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return '0%';
    
    let totalConcluido = 0;
    const total = sgzData.length;
    
    sgzData.forEach(order => {
      const status = (order.sgz_status || '').toUpperCase();
      if (status.includes('CONC') || status.includes('FECHA')) {
        totalConcluido += 1;
      }
    });
    
    let percentConcluido = (totalConcluido / total * 100);
    
    if (isSimulationActive) {
      percentConcluido = Math.min(percentConcluido + 15, 100); // Aumenta em 15% na simulação
    }
    
    return `${percentConcluido.toFixed(1)}%`;
  }, [sgzData, isSimulationActive]);

  // Format with comma instead of dot
  const formattedStats = stats.replace('.', ',');

  return (
    <ChartCard
      title="Serviços em Andamento"
      subtitle="Evolução do status das ordens de serviço na semana"
      value={formattedStats}
      isLoading={isLoading}
    >
      {chartData && (
        <Line data={chartData} options={options} />
      )}
    </ChartCard>
  );
};

export default EvolutionChart;
