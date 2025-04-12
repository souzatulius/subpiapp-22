
import React, { useState } from 'react';
import { useZeladoriaChartDataMock } from '@/hooks/ranking/useZeladoriaChartDataMock';
import { generateChartDataFromStatus, generateChartDataFromDistrict } from '@/utils/chartDataUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pie } from 'react-chartjs-2';
import { pieChartColors } from '../utils/chartColors';
import { Button } from '@/components/ui/button';

export default function ChartDataDebugger() {
  const { data, isLoading, error, refresh } = useZeladoriaChartDataMock(500);
  const [activeTab, setActiveTab] = useState('raw');

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="ml-2 text-orange-600">Carregando dados mock...</p>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px] text-red-500">
          <p>Erro ao carregar dados: {error || 'Dados não disponíveis'}</p>
          <Button onClick={refresh} variant="outline" size="sm" className="ml-2">
            Tentar novamente
          </Button>
        </div>
      </Card>
    );
  }

  // Prepare data for visualization
  const statusChartData = {
    labels: Object.keys(data.por_status),
    datasets: [{
      data: Object.values(data.por_status),
      backgroundColor: pieChartColors,
      borderWidth: 1,
      borderColor: '#fff'
    }]
  };

  const districtChartData = {
    labels: Object.keys(data.por_distrito),
    datasets: [{
      data: Object.values(data.por_distrito),
      backgroundColor: pieChartColors,
      borderWidth: 1,
      borderColor: '#fff'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-orange-50 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-orange-700">
            Debugger de Dados
          </CardTitle>
          <Button onClick={refresh} variant="outline" size="sm">
            Recarregar
          </Button>
        </div>
        <p className="text-xs text-orange-600">
          Visualização de dados para desenvolvimento
        </p>
      </CardHeader>

      <Tabs defaultValue="raw" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="w-full bg-orange-100/50">
            <TabsTrigger value="raw">Dados Brutos</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="district">Distritos</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-4">
          <TabsContent value="raw" className="mt-0">
            <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-auto">
              <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-0">
            <div className="h-[300px]">
              {Object.keys(data.por_status).length > 0 ? (
                <Pie data={statusChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Sem dados de status disponíveis</p>
                </div>
              )}
            </div>
            <div className="mt-4 bg-gray-100 p-4 rounded-md">
              <pre className="text-xs">{JSON.stringify(data.por_status, null, 2)}</pre>
            </div>
          </TabsContent>

          <TabsContent value="district" className="mt-0">
            <div className="h-[300px]">
              {Object.keys(data.por_distrito).length > 0 ? (
                <Pie data={districtChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Sem dados de distritos disponíveis</p>
                </div>
              )}
            </div>
            <div className="mt-4 bg-gray-100 p-4 rounded-md">
              <pre className="text-xs">{JSON.stringify(data.por_distrito, null, 2)}</pre>
            </div>
          </TabsContent>

          <TabsContent value="kpis" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total OS</p>
                <p className="text-2xl font-bold text-blue-700">{data.kpis.total_os}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">OS Fechadas</p>
                <p className="text-2xl font-bold text-green-700">{data.kpis.os_fechadas}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">OS Pendentes</p>
                <p className="text-2xl font-bold text-orange-700">{data.kpis.os_pendentes}</p>
              </div>
            </div>
            <div className="mt-4 bg-gray-100 p-4 rounded-md">
              <pre className="text-xs">{JSON.stringify(data.kpis, null, 2)}</pre>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
