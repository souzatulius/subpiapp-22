
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface LineChartProps {
  data: any[];
  xAxisDataKey: string;
  lines: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }[];
  yAxisTicks?: number[];
  showLegend?: boolean;
  showTimeAxis?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  xAxisDataKey, 
  lines,
  yAxisTicks,
  showLegend = true,
  showTimeAxis = false
}) => {
  // Format the number with dot as thousand separator and comma for decimal
  const formatNumber = (value: number) => {
    if (typeof value !== 'number') return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Ensure default font color for better printing
  const tickStyle = { fill: '#64748b' };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">Sem dados disponíveis</p>
      </div>
    );
  }

  // Format x-axis ticks for time axis (days of month)
  const formatXAxisTick = (value: any) => {
    if (showTimeAxis) {
      // Check if value is a date string or a day abbreviation
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(value).getDate(); // Return only the day number
      } else if (typeof value === 'string' && ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].includes(value)) {
        return value; // Keep day abbreviation
      } else if (typeof value === 'string' && ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].includes(value)) {
        return value; // Keep month abbreviation
      }
    }
    return value;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={xAxisDataKey} 
          tickFormatter={showTimeAxis ? formatXAxisTick : undefined}
          style={tickStyle} 
        />
        <YAxis 
          ticks={yAxisTicks} 
          tickFormatter={formatNumber} 
          style={tickStyle} 
        />
        <Tooltip 
          formatter={(value) => [formatNumber(value as number), '']}
        />
        {showLegend && <Legend />}
        
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
