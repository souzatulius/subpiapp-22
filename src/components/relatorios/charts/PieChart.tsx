
import React from 'react';
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  colorSet?: 'blue' | 'orange' | 'green' | 'status';
  showLabels?: boolean;
  showOnlyPercentage?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  colors, 
  colorSet = 'blue',
  showLabels = true,
  showOnlyPercentage = false
}) => {
  const getColorPalette = () => {
    if (colors) return colors;
    
    switch (colorSet) {
      case 'blue':
        return ['#0066FF', '#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD'];
      case 'orange':
        return ['#F5B700', '#F89E66', '#F25C05', '#FB923C', '#FED7AA'];
      case 'green':
        return ['#84cc16', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];
      case 'status':
        return ['#22c55e', '#0066FF', '#ef4444', '#4B5563', '#D4D4D4'];
      default:
        return ['#0066FF', '#1D4ED8', '#F5B700', '#D4D4D4', '#4B5563'];
    }
  };

  const defaultColors = getColorPalette();
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalValue) * 100).toFixed(1);
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">
            {showOnlyPercentage 
              ? `${percentage}%` 
              : `${percentage}% (${payload[0].value})`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Updated custom label to display percentages outside the pie chart
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    // Calculate the position for the label outside the pie
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show labels for segments with more than 3% of the total
    if (percent < 0.03) return null;

    const textAnchor = x > cx ? 'start' : 'end';

    return (
      <text 
        x={x} 
        y={y} 
        fill="#71717a" 
        textAnchor={textAnchor} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-3">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-1 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">Sem dados disponíveis</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={2}
          label={showLabels ? CustomLabel : false}
          labelLine={showLabels ? true : false}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={defaultColors[index % defaultColors.length]} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          content={renderCustomizedLegend}
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center" 
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
