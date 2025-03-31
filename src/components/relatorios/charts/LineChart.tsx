
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<Record<string, any>>;
  title?: string;
  xAxisDataKey: string;
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }>;
  className?: string;
  insight?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  xAxisDataKey, 
  lines,  
  className
}) => {
  // Validate input data
  const isDataValid = Array.isArray(data) && data.length > 0;
  const areLinesValid = Array.isArray(lines) && lines.length > 0;

  // If data or lines are invalid, render placeholder
  if (!isDataValid || !areLinesValid) {
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
        <RechartsLineChart
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
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || defaultColors[index % defaultColors.length]}
              strokeWidth={line.strokeWidth || 2}
              activeDot={{ r: 8, fill: '#f97316' }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
