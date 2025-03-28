
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

export const PieChart: React.FC<PieChartProps> = ({ data, title, insight, colors }) => {
  // Default orange color palette if colors are not provided
  const defaultColors = ['#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412'];
  const chartColors = colors || defaultColors;

  return (
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
        />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
