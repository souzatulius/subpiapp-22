
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ESICProcessesChartProps {
  total: number;
  responded: number;
  justified: number;
  isLoading?: boolean;
}

const ESICProcessesChart: React.FC<ESICProcessesChartProps> = ({ 
  total, 
  responded, 
  justified,
  isLoading = false 
}) => {
  // Calculate the pending (not responded) count
  const pending = total - responded;
  
  // Prepare data for the pie chart
  const data = [
    { name: 'Respondidos', value: responded },
    { name: 'Justificados', value: justified },
    { name: 'Pendentes', value: pending > 0 ? pending : 0 }
  ];
  
  // Colors for the pie chart sections
  const COLORS = ['#4CAF50', '#FF9800', '#F44336'];

  if (isLoading) {
    return (
      <Card className="w-full h-full min-h-[300px] flex items-center justify-center">
        <p className="text-gray-400">Carregando dados...</p>
      </Card>
    );
  }
  
  return (
    <Card className="w-full h-full min-h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Processos e-SIC</CardTitle>
        <p className="text-2xl font-bold mt-2">{total}</p>
        <p className="text-sm text-gray-500">Total de processos cadastrados</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} processos`, '']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ESICProcessesChart;
