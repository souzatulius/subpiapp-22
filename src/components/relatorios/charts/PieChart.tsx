
import React from 'react';
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChartProps {
  data: any[];
  colors?: string[];
  colorSet?: 'default' | 'blue' | 'orange';
  showLabels?: boolean;
  showOnlyPercentage?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  colors,
  colorSet = 'default',
  showLabels = false,
  showOnlyPercentage = false
}) => {
  // Define color sets for consistent styling
  const colorSets = {
    default: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'],
    blue: ['#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8'],
    orange: ['#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c']
  };

  // Choose colors from predefined sets or use provided colors
  const chartColors = colors || colorSets[colorSet];
  
  // Calculate total for percentage
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">Sem dados disponíveis</p>
      </div>
    );
  }

  // Custom tooltip formatter for percentage or value display
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="p-2 bg-white shadow-md border rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          {showOnlyPercentage ? (
            <p className="text-sm">{percentage}%</p>
          ) : (
            <p className="text-sm">{payload[0].value} ({percentage}%)</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom label renderer for displaying labels on the chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    if (!showLabels) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {showOnlyPercentage 
          ? `${(percent * 100).toFixed(0)}%` 
          : `${data[index].name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Tooltip content={customTooltip} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
