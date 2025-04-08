import React from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface BarChartProps {
  data: any[];
  xAxisDataKey: string;
  bars: {
    dataKey: string;
    name: string;
    color: string;
    stackId?: string;
  }[];
  yAxisTicks?: number[];
  horizontal?: boolean;
  tooltipFormatter?: (value: any, name: any, item: any) => any[];
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  xAxisDataKey, 
  bars,
  yAxisTicks,
  horizontal = false,
  tooltipFormatter
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout={horizontal ? 'vertical' : 'horizontal'}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        
        {horizontal ? (
          <>
            <XAxis type="number" tickFormatter={formatNumber} style={tickStyle} />
            <YAxis dataKey={xAxisDataKey} type="category" style={tickStyle} />
          </>
        ) : (
          <>
            <XAxis dataKey={xAxisDataKey} style={tickStyle} />
            <YAxis ticks={yAxisTicks} tickFormatter={formatNumber} style={tickStyle} />
          </>
        )}
        
        <Tooltip 
          formatter={tooltipFormatter || ((value) => [formatNumber(value as number), ''])}
        />
        
        <Legend />
        
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            stackId={bar.stackId}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
