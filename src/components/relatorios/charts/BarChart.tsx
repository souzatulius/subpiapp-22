
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<Record<string, any>>;
  title?: string;
  xAxisDataKey: string;
  bars: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  className?: string;
  insight?: string;
  horizontal?: boolean;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  xAxisDataKey, 
  bars, 
  className,
  horizontal = false,
  stacked = false
}) => {
  // Validate input data
  const isDataValid = Array.isArray(data) && data.length > 0;
  const areBarsValid = Array.isArray(bars) && bars.length > 0;

  // If data or bars are invalid, render placeholder
  if (!isDataValid || !areBarsValid) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <p className="text-blue-200">Dados não disponíveis</p>
      </div>
    );
  }
  
  return (
    <div className={`h-full w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          {horizontal ? (
            <>
              <XAxis type="number" stroke="#e2e8f0" />
              <YAxis dataKey={xAxisDataKey} type="category" stroke="#e2e8f0" />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisDataKey} stroke="#e2e8f0" />
              <YAxis stroke="#e2e8f0" />
            </>
          )}
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e3a8a', borderColor: '#2563eb', color: '#ffffff' }} 
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          {bars.map((bar, index) => (
            <Bar 
              key={index} 
              dataKey={bar.dataKey} 
              name={bar.name} 
              fill={bar.color || '#3b82f6'} 
              stackId={stacked ? "stack" : undefined} 
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
