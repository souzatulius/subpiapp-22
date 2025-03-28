
import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AreaChartProps {
  data: Array<Record<string, any>>;
  title: string;
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
  title, 
  xAxisDataKey, 
  areas, 
  className,
  insight,
  stacked = false
}) => {
  // Validate input data
  const isDataValid = Array.isArray(data) && data.length > 0;
  const areAreasValid = Array.isArray(areas) && areas.length > 0;

  // If data or areas are invalid, render placeholder
  if (!isDataValid || !areAreasValid) {
    return (
      <div className={`h-full bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg shadow-sm ${className}`}>
        <div className="p-4 border-b border-blue-100">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          {insight && <p className="text-sm text-blue-100">{insight}</p>}
        </div>
        <div className="p-4">
          <div className="h-[200px] w-full flex items-center justify-center">
            <p className="text-blue-200">Dados não disponíveis</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`h-full bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b border-blue-700">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {insight && <p className="text-sm text-blue-100">{insight}</p>}
      </div>
      <div className="p-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
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
              {areas.map((area, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={area.dataKey}
                  name={area.name}
                  stroke={area.color || '#3b82f6'}
                  fill={area.color || '#3b82f6'}
                  fillOpacity={area.fillOpacity || 0.3}
                  stackId={stacked ? "stack" : undefined}
                />
              ))}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
