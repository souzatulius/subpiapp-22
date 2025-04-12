
import React from 'react';
import { useZeladoriaChartDataMock } from '@/hooks/ranking/useZeladoriaChartDataMock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pie, Bar } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ZeladoriaChartExample: React.FC = () => {
  const { data, isLoading, error, refresh } = useZeladoriaChartDataMock();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600">
        <p className="font-medium">Erro ao carregar dados:</p>
        <p>{error || 'Dados não disponíveis'}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={refresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  // Extract data for pie chart
  const statusData = {
    labels: Object.keys(data.por_status),
    datasets: [
      {
        data: Object.values(data.por_status),
        backgroundColor: [
          '#3b82f6', // blue
          '#f97316', // orange
          '#22c55e', // green
          '#ef4444', // red
          '#a855f7', // purple
        ]
      }
    ]
  };
  
  // Extract data for bar chart
  const districtData = {
    labels: Object.keys(data.por_distrito),
    datasets: [
      {
        label: 'Ordens de Serviço',
        data: Object.values(data.por_distrito),
        backgroundColor: '#3b82f6',
      }
    ]
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Exemplo de Gráficos com Dados Mock</h2>
        <Button 
          variant="outline"
          size="sm"
          onClick={refresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total OS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.kpis.total_os}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">OS Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{data.kpis.os_fechadas}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">OS Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-500">{data.kpis.os_pendentes}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <Pie 
              data={statusData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  }
                }
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Distrito</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar 
              data={districtData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZeladoriaChartExample;
