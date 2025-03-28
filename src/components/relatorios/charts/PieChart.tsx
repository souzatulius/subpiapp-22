
import React from 'react';
import { PieChart as RechartsBarChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface PieChartProps {
  data: DataItem[];
  title?: string;
  insight?: string;
  colors?: string[];
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  colors 
}) => {
  // Default gray color palette if colors are not provided
  const defaultColors = ['#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a'];
  const chartColors = colors || defaultColors;

  // Validate input data
  const isDataValid = Array.isArray(data) && data.length > 0;

  // If data is invalid, render placeholder
  if (!isDataValid) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">Dados não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}`, 'Quantidade']}
            labelFormatter={(label) => `${label}`}
            contentStyle={{ backgroundColor: '#27272a', borderColor: '#3f3f46', color: '#ffffff' }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ color: '#d4d4d8' }}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
