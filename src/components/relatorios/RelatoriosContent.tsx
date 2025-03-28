
import React from 'react';
import { Card } from '@/components/ui/card';
import { DateRange } from '@/components/ui/date-range-picker';
import { PieChart } from './charts/PieChart';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';
import { AreaChart } from './charts/AreaChart';
import { RelatorioCard } from './components/RelatorioCard';

interface RelatoriosContentProps {
  filterDialogOpen?: boolean;
  setFilterDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RelatoriosContent: React.FC<RelatoriosContentProps> = () => {
  // Sample state - in a real app, this would come from a hook or context
  const [dateRange] = React.useState<DateRange>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  
  // Sample chart data
  const pieChartData = [
    { name: 'Pendentes', value: 30 },
    { name: 'Em Andamento', value: 50 },
    { name: 'Concluídas', value: 100 },
    { name: 'Canceladas', value: 20 },
  ];
  
  const lineChartData = [
    { name: 'Jan', Demandas: 12 },
    { name: 'Fev', Demandas: 19 },
    { name: 'Mar', Demandas: 3 },
    { name: 'Abr', Demandas: 5 },
    { name: 'Mai', Demandas: 2 },
    { name: 'Jun', Demandas: 3 },
  ];
  
  const barChartData = [
    { name: 'Tema 1', Quantidade: 12 },
    { name: 'Tema 2', Quantidade: 19 },
    { name: 'Tema 3', Quantidade: 3 },
    { name: 'Tema 4', Quantidade: 5 },
    { name: 'Tema 5', Quantidade: 2 },
  ];
  
  const areaChartData = [
    { name: 'Jan', Notas: 12 },
    { name: 'Fev', Notas: 19 },
    { name: 'Mar', Notas: 3 },
    { name: 'Abr', Notas: 5 },
    { name: 'Mai', Notas: 2 },
    { name: 'Jun', Notas: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Temas Técnicos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Temas Técnicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Distribuição por Temas">
            <BarChart 
              data={barChartData}
              title="Distribuição por Temas"
              xAxisDataKey="name"
              bars={[
                { dataKey: 'Quantidade', name: 'Quantidade', color: '#0FA0CE' }
              ]}
            />
          </RelatorioCard>
          <RelatorioCard title="Complexidade por Tema">
            <AreaChart 
              data={areaChartData}
              title="Complexidade por Tema"
              xAxisDataKey="name"
              areas={[
                { dataKey: 'Notas', name: 'Notas', color: '#ea384c' }
              ]}
            />
          </RelatorioCard>
        </div>
      </div>
      
      {/* Tempo e Desempenho */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tempo e Desempenho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Tempo Médio de Resposta">
            <LineChart 
              data={lineChartData}
              title="Tempo Médio de Resposta"
              xAxisDataKey="name"
              lines={[
                { dataKey: 'Demandas', name: 'Tempo (dias)', color: '#198754' }
              ]}
            />
          </RelatorioCard>
          <RelatorioCard title="Performance por Área">
            <BarChart 
              data={barChartData}
              title="Performance por Área"
              xAxisDataKey="name"
              bars={[
                { dataKey: 'Quantidade', name: 'Eficiência', color: '#FFC107' }
              ]}
            />
          </RelatorioCard>
        </div>
      </div>
      
      {/* Notas Oficiais */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Notas Oficiais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Notas Emitidas">
            <AreaChart 
              data={areaChartData}
              title="Notas Emitidas"
              xAxisDataKey="name"
              areas={[
                { dataKey: 'Notas', name: 'Quantidade', color: '#6C757D' }
              ]}
            />
          </RelatorioCard>
          <RelatorioCard title="Notas por Tema">
            <PieChart 
              data={pieChartData}
              title="Notas por Tema"
              insight="Distribuição de notas por tema"
            />
          </RelatorioCard>
        </div>
      </div>
      
      {/* Tendências */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tendências</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Evolução Mensal">
            <LineChart 
              data={lineChartData}
              title="Evolução Mensal"
              xAxisDataKey="name"
              lines={[
                { dataKey: 'Demandas', name: 'Demandas', color: '#1EAEDB' }
              ]}
            />
          </RelatorioCard>
          <RelatorioCard title="Comparativo Anual">
            <BarChart 
              data={barChartData}
              title="Comparativo Anual"
              xAxisDataKey="name"
              bars={[
                { dataKey: 'Quantidade', name: 'Quantidade', color: '#0FA0CE' }
              ]}
            />
          </RelatorioCard>
        </div>
      </div>
    </div>
  );
};

