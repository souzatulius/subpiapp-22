
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface LineProps {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
  dot?: boolean;
}

interface LineChartProps {
  data: any[];
  xAxisDataKey: string;
  lines: LineProps[];
  yAxisTicks?: number[];
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  xAxisDataKey,
  lines,
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
      <RechartsLineChart
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
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value: number, name: string) => [`${value} min`, name]}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
        />
        {lines.map((line, index) => (
          <Line
            key={`line-${index}`}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            dot={line.dot !== false}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
