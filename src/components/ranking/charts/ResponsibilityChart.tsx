
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { chartTheme } from './ChartRegistration';

interface ResponsibilityChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ResponsibilityChart: React.FC<ResponsibilityChartProps> = ({ 
  data,
  sgzData,
  painelData,
  isLoading,
  isSimulationActive
}) => {
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Por padrão, consideramos todas as OS como responsabilidade da subprefeitura
    let subTotal = sgzData.length;
    let externalTotal = 0;
    let externalCompanies: Record<string, number> = {};
    
    // Se tivermos dados do painel, podemos identificar as responsabilidades reais
    if (painelData && painelData.length > 0) {
      // Criar mapa de IDs de OS para fácil busca
      const painelMap = new Map();
      
      painelData.forEach(item => {
        if (item.id_os) {
          painelMap.set(item.id_os.toString().trim(), item);
        }
      });
      
      // Identificar responsáveis externos
      subTotal = 0;
      externalTotal = 0;
      
      sgzData.forEach(order => {
        const orderNumber = order.ordem_servico?.toString().trim();
        if (!orderNumber) return;
        
        const painelItem = painelMap.get(orderNumber);
        
        if (painelItem && painelItem.responsavel_real) {
          const responsavel = painelItem.responsavel_real.toUpperCase();
          
          // Verificar se é um responsável externo
          if (responsavel.includes('SABESP') || 
              responsavel.includes('ENEL') || 
              responsavel.includes('EXTERNO') || 
              responsavel.includes('COMGAS')) {
            
            externalTotal++;
            
            // Agrupar por empresa
            const empresa = responsavel.includes('SABESP') ? 'SABESP' : 
                           responsavel.includes('ENEL') ? 'ENEL' : 
                           responsavel.includes('COMGAS') ? 'COMGÁS' : 'OUTROS';
                           
            externalCompanies[empresa] = (externalCompanies[empresa] || 0) + 1;
          } else {
            subTotal++;
          }
        } else {
          subTotal++;
        }
      });
    }
    
    // Aplicar simulação se ativa
    if (isSimulationActive) {
      // Em um cenário ideal, as OS externas seriam identificadas e tratadas adequadamente
      // Aqui apenas ajustamos os percentuais para refletir uma distribuição mais ideal
      
      // Na simulação, consideramos que 20% mais OS seriam identificadas como externas
      // Essas OS viriam do grupo de "subprefeitura" atual
      if (painelData && painelData.length > 0) {
        const additionalExternal = Math.floor(subTotal * 0.2);
        subTotal -= additionalExternal;
        externalTotal += additionalExternal;
        
        // Distribuir as novas OS externas entre as empresas
        Object.keys(externalCompanies).forEach(empresa => {
          const adicional = Math.floor(additionalExternal / Object.keys(externalCompanies).length);
          externalCompanies[empresa] += adicional;
        });
      } else {
        // Se não tivermos dados do painel, criar uma simulação simples
        externalTotal = Math.floor(sgzData.length * 0.3); // 30% externas
        subTotal = sgzData.length - externalTotal;
        
        externalCompanies = {
          'SABESP': Math.floor(externalTotal * 0.4),
          'ENEL': Math.floor(externalTotal * 0.3),
          'COMGÁS': Math.floor(externalTotal * 0.1),
          'OUTROS': Math.floor(externalTotal * 0.2)
        };
      }
    }
    
    return {
      labels: ['Subprefeitura', 'Entidades Externas'],
      datasets: [
        {
          data: [subTotal, externalTotal],
          backgroundColor: ['#f97316', '#71717a'], // orange-500, gray-500
          borderColor: 'white',
          borderWidth: 2,
        }
      ]
    };
  }, [sgzData, painelData, isSimulationActive]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return '0%';
    
    let subTotal = sgzData.length;
    let externalTotal = 0;
    
    if (painelData && painelData.length > 0) {
      // Usar painelData para calcular responsabilidade real
      const painelMap = new Map();
      
      painelData.forEach(item => {
        if (item.id_os) {
          painelMap.set(item.id_os.toString().trim(), item);
        }
      });
      
      subTotal = 0;
      externalTotal = 0;
      
      sgzData.forEach(order => {
        const orderNumber = order.ordem_servico?.toString().trim();
        if (!orderNumber) return;
        
        const painelItem = painelMap.get(orderNumber);
        
        if (painelItem && painelItem.responsavel_real) {
          const responsavel = painelItem.responsavel_real.toUpperCase();
          
          if (responsavel.includes('SABESP') || 
              responsavel.includes('ENEL') || 
              responsavel.includes('EXTERNO') || 
              responsavel.includes('COMGAS')) {
            externalTotal++;
          } else {
            subTotal++;
          }
        } else {
          subTotal++;
        }
      });
    }
    
    if (isSimulationActive) {
      // Ajustar os percentuais para cenário simulado
      if (painelData && painelData.length > 0) {
        const additionalExternal = Math.floor(subTotal * 0.2);
        subTotal -= additionalExternal;
        externalTotal += additionalExternal;
      } else {
        externalTotal = Math.floor(sgzData.length * 0.3); // 30% externas
        subTotal = sgzData.length - externalTotal;
      }
    }
    
    const total = subTotal + externalTotal;
    const percentage = total > 0 ? Math.round((externalTotal / total) * 100) : 0;
    
    return `${percentage}% externas`;
  }, [sgzData, painelData, isSimulationActive]);

  return (
    <ChartCard
      title="Responsabilidade Real"
      value={stats}
      isLoading={isLoading}
    >
      {chartData && (
        <div className="flex items-center justify-center h-full">
          <Doughnut data={chartData} options={options} />
        </div>
      )}
    </ChartCard>
  );
};

export default ResponsibilityChart;
