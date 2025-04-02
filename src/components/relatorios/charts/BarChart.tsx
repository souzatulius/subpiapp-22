
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartConfigs } from '../hooks/charts/useChartConfigs';

interface BarChartProps {
  data: Array<Record<string, any>>;
  title?: string;
  xAxisDataKey: string;
  bars: Array<{
    dataKey: string;
    name: string;
    color?: string;
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
  // Get the color configs
  const { chartColors } = useChartConfigs();

  // Validate input data
  const isDataValid = Array.isArray(data) && data.length > 0;
  const areBarsValid = Array.isArray(bars) && bars.length > 0;

  // If data or bars are invalid, render placeholder
  if (!isDataValid || !areBarsValid) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <p className="text-orange-200">Dados não disponíveis</p>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#71717a" />
          {horizontal ? (
            <>
              <XAxis type="number" stroke="#71717a" />
              <YAxis dataKey={xAxisDataKey} type="category" stroke="#71717a" />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisDataKey} stroke="#71717a" />
              <YAxis stroke="#71717a" />
            </>
          )}
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e40af', borderColor: '#0ea5e9', color: '#ffffff' }} 
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend wrapperStyle={{ color: '#71717a' }} />
          {bars.map((bar, index) => (
            <Bar 
              key={index} 
              dataKey={bar.dataKey} 
              name={bar.name} 
              fill={bar.color || chartColors[index % chartColors.length]} 
              stackId={stacked ? "stack" : undefined} 
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
