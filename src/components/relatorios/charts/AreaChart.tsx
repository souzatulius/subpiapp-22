
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend 
} from 'recharts';

interface AreaProps {
  dataKey: string;
  name: string;
  color: string;
  fillOpacity?: number;
}

interface AreaChartProps {
  data: any[];
  xAxisDataKey: string;
  areas: AreaProps[];
  yAxisTicks?: number[];
}

export const AreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  xAxisDataKey, 
  areas,
  yAxisTicks
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">Sem dados disponíveis</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis 
          dataKey={xAxisDataKey} 
          tick={{ fontSize: 12 }} 
          axisLine={false} 
          tickLine={false} 
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          axisLine={false} 
          tickLine={false}
          ticks={yAxisTicks}
        />
        <Tooltip 
          contentStyle={{ fontSize: '12px', borderRadius: '6px' }}
          formatter={(value: number, name: string) => [value, name]}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        
        {areas.map((area, index) => (
          <Area
            key={`area-${index}`}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stroke={area.color}
            fill={area.color}
            fillOpacity={area.fillOpacity || 0.3}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};
