
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
  // Default blue color palette if colors are not provided
  const defaultColors = ['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'];
  const chartColors = colors || defaultColors;

  return (
    <div className="h-full bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-lg shadow-sm">
      <div className="p-4 border-b border-blue-700">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {insight && <p className="text-sm text-blue-100">{insight}</p>}
      </div>
      <div className="p-4">
        <div className="h-[200px] w-full">
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
                contentStyle={{ backgroundColor: '#1e3a8a', borderColor: '#2563eb', color: '#ffffff' }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ color: '#e2e8f0' }}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
