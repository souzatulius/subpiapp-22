
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
        <p className="text-blue-200">Dados não disponíveis</p>
      </div>
    );
  }
  
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
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis dataKey={xAxisDataKey} stroke="#e2e8f0" />
          <YAxis stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e3a8a', borderColor: '#2563eb', color: '#ffffff' }} 
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || '#3b82f6'}
              strokeWidth={line.strokeWidth || 2}
              activeDot={{ r: 8, fill: '#93c5fd' }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
