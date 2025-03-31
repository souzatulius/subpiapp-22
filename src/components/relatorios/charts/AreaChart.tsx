
import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AreaChartProps {
  data: Array<Record<string, any>>;
  title?: string;
  xAxisDataKey: string;
  areas: Array<{
    dataKey: string;
    name: string;
    color: string;
    fillOpacity?: number;
  }>;
  className?: string;
  insight?: string;
  stacked?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  xAxisDataKey, 
  areas, 
  className,
  stacked = false
}) => {
  // Validate input data
  const isDataValid = Array.isArray(data) && data.length > 0;
  const areAreasValid = Array.isArray(areas) && areas.length > 0;

  // If data or areas are invalid, render placeholder
  if (!isDataValid || !areAreasValid) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <p className="text-orange-200">Dados não disponíveis</p>
      </div>
    );
  }
  
  // Default colors if not provided
  const defaultColors = ['#f97316', '#0ea5e9', '#1e40af', '#71717a', '#27272a'];
  
  return (
    <div className={`h-full w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#71717a" />
          <XAxis dataKey={xAxisDataKey} stroke="#71717a" />
          <YAxis stroke="#71717a" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e40af', borderColor: '#0ea5e9', color: '#ffffff' }} 
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend wrapperStyle={{ color: '#71717a' }} />
          {areas.map((area, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={area.dataKey}
              name={area.name}
              stroke={area.color || defaultColors[index % defaultColors.length]}
              fill={area.color || defaultColors[index % defaultColors.length]}
              fillOpacity={area.fillOpacity || 0.3}
              stackId={stacked ? "stack" : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
