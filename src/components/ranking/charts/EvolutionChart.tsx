
// This is just a stub file to demonstrate the concept. In a real application, we'd implement the actual chart.
import React, { useState } from 'react';
import ChartCard from './ChartCard';
import ChartAnalysis from './ChartAnalysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EvolutionChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const EvolutionChart: React.FC<EvolutionChartProps> = ({ data, sgzData, painelData, isLoading, isSimulationActive }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Sample data for the chart
  const chartData = [
    {
      date: '01/05',
      pendentes: 78,
      concluidas: 41,
      canceladas: 12
    },
    {
      date: '02/05',
      pendentes: 73,
      concluidas: 45,
      canceladas: 10
    },
    {
      date: '03/05',
      pendentes: 68,
      concluidas: 48,
      canceladas: 9
    },
    {
      date: '04/05',
      pendentes: 65,
      concluidas: 52,
      canceladas: 8
    },
    {
      date: '05/05',
      pendentes: 63,
      concluidas: 56,
      canceladas: 7
    },
    {
      date: '06/05',
      pendentes: 61,
      concluidas: 58,
      canceladas: 7
    },
    {
      date: '07/05',
      pendentes: 58,
      concluidas: 60,
      canceladas: 6
    }
  ];
  
  // Analysis text for this chart
  const analysisText = "A análise da evolução dos serviços mostra uma tendência positiva no fechamento de ordens de serviço, com um aumento constante de 41 para 60 OS concluídas no período de uma semana. Ao mesmo tempo, observamos uma redução nas OS pendentes de 78 para 58, representando uma melhoria de 25% na capacidade de resolução. O número de cancelamentos também diminuiu de 12 para 6, indicando uma melhor triagem inicial das demandas. Esta tendência está diretamente relacionada à implementação do novo fluxo de trabalho e à redistribuição de demandas entre equipes técnicas, conforme recomendado no relatório anterior.";
  
  const toggleAnalysis = () => {
    setShowAnalysis(prev => !prev);
  };

  return (
    <ChartCard
      title="Evolução de Serviços em Andamento"
      subtitle="Últimos 7 dias"
      value={isSimulationActive ? '58%' : '52%'}
      isLoading={isLoading}
      trendIndicator={<span className="text-green-500 text-xs">+6%</span>}
      onToggleAnalysis={toggleAnalysis}
      showAnalysis={showAnalysis}
      analysis={analysisText}
    >
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pendentes" stroke="#ff7300" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="concluidas" stroke="#82ca9d" />
            <Line type="monotone" dataKey="canceladas" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        
        {!showAnalysis && (
          <ChartAnalysis 
            title="Evolução de Serviços em Andamento" 
            analysis={analysisText.substring(0, 120) + "..."} 
            onToggleView={toggleAnalysis}
          />
        )}
      </div>
    </ChartCard>
  );
};

export default EvolutionChart;
