
import React from 'react';
import { PieChart as RechartsBarChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataItem {
  name: string;
  value?: number;  // Changed to optional for compatibility with ChartData
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
  // Define a palette with orange, blue, dark blue, gray and dark gray
  const defaultColors = ['#f97316', '#0ea5e9', '#1e40af', '#71717a', '#27272a'];
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

  // Filter out items without a value property
  const validData = data.filter(item => typeof item.value === 'number');

  // If no valid data remains after filtering, show placeholder
  if (validData.length === 0) {
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
            data={validData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#f97316"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {validData.map((entry, index) => (
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
            wrapperStyle={{ color: '#71717a' }}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
