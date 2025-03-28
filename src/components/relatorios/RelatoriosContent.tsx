
import React from 'react';
import { FiltersSection } from './filters/FiltersSection';
import { Card } from '@/components/ui/card';
import { DateRange } from '@/components/ui/date-range-picker';
import { PieChart } from './charts/PieChart';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';
import { AreaChart } from './charts/AreaChart';
import { StatsCard } from './components/StatsCard';
import { RelatorioCard } from './components/RelatorioCard';

interface RelatoriosContentProps {
  filterDialogOpen?: boolean;
  setFilterDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RelatoriosContent: React.FC<RelatoriosContentProps> = ({
  filterDialogOpen,
  setFilterDialogOpen
}) => {
  // Sample state - in a real app, this would come from a hook or context
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  
  const [coordenacao, setCoordenacao] = React.useState('todos');
  const [tema, setTema] = React.useState('todos');
  
  // Sample data - in a real app, this would come from an API or database
  const coordenacoes = [
    { id: '1', descricao: 'Coordenação 1' },
    { id: '2', descricao: 'Coordenação 2' },
    { id: '3', descricao: 'Coordenação 3' },
  ];
  
  const temas = [
    { id: '1', descricao: 'Tema 1' },
    { id: '2', descricao: 'Tema 2' },
    { id: '3', descricao: 'Tema 3' },
  ];
  
  // Sample chart data - in a real app, this would come from an API or database
  const pieChartData = {
    labels: ['Pendentes', 'Em Andamento', 'Concluídas', 'Canceladas'],
    datasets: [
      {
        data: [30, 50, 100, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };
  
  const lineChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Demandas',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#4BC0C0',
      },
    ],
  };
  
  const barChartData = {
    labels: ['Tema 1', 'Tema 2', 'Tema 3', 'Tema 4', 'Tema 5'],
    datasets: [
      {
        label: 'Quantidade',
        data: [12, 19, 3, 5, 2],
        backgroundColor: '#36A2EB',
      },
    ],
  };
  
  const areaChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Notas Oficiais',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };
  
  const handleResetFilters = () => {
    setDateRange({
      from: new Date(2023, 0, 1),
      to: new Date(),
    });
    setCoordenacao('todos');
    setTema('todos');
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <FiltersSection
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        coordenacao={coordenacao}
        onCoordenacaoChange={setCoordenacao}
        coordenacoes={coordenacoes}
        tema={tema}
        onTemaChange={setTema}
        temas={temas}
        onResetFilters={handleResetFilters}
      />
      
      {/* Visão Geral */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Visão Geral</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total de Demandas"
            value="420"
            change="+5%"
            changeType="increase"
          />
          <StatsCard
            title="Tempo Médio de Resposta"
            value="3.2 dias"
            change="-12%"
            changeType="decrease"
            isPositive={true}
          />
          <StatsCard
            title="Notas Emitidas"
            value="87"
            change="+15%"
            changeType="increase"
          />
          <StatsCard
            title="Demandas Pendentes"
            value="32"
            change="+2"
            changeType="increase"
            isPositive={false}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Status das Demandas">
            <PieChart data={pieChartData} />
          </RelatorioCard>
          <RelatorioCard title="Evolução de Demandas">
            <LineChart data={lineChartData} />
          </RelatorioCard>
        </div>
      </div>
      
      {/* Temas Técnicos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Temas Técnicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Distribuição por Temas">
            <BarChart data={barChartData} />
          </RelatorioCard>
          <RelatorioCard title="Complexidade por Tema">
            <AreaChart data={areaChartData} />
          </RelatorioCard>
        </div>
      </div>
      
      {/* Tempo e Desempenho */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tempo e Desempenho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Tempo Médio de Resposta">
            <LineChart data={lineChartData} />
          </RelatorioCard>
          <RelatorioCard title="Performance por Área">
            <BarChart data={barChartData} />
          </RelatorioCard>
        </div>
      </div>
      
      {/* Notas Oficiais */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Notas Oficiais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Notas Emitidas">
            <AreaChart data={areaChartData} />
          </RelatorioCard>
          <RelatorioCard title="Notas por Tema">
            <PieChart data={pieChartData} />
          </RelatorioCard>
        </div>
      </div>
      
      {/* Tendências */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tendências</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatorioCard title="Evolução Mensal">
            <LineChart data={lineChartData} />
          </RelatorioCard>
          <RelatorioCard title="Comparativo Anual">
            <BarChart data={barChartData} />
          </RelatorioCard>
        </div>
      </div>
    </div>
  );
};
