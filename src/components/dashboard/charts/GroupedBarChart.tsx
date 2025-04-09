
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, TooltipProps
} from 'recharts';
import { ChartData } from '@/types/charts';

interface GroupedBarChartProps {
  data: ChartData[];
  height?: number;
  className?: string;
  compact?: boolean;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  data,
  height = 300,
  className = '',
  compact = false
}) => {
  const barColors = ['#3b82f6', '#f97316'];

  const getBarColor = (name: string, seriesIndex: number): string => {
    const colorIndex = seriesIndex % barColors.length;
    return barColors[colorIndex];
  };

  const CustomTooltip = ({ active, payload, label, compact }: TooltipProps<any, any> & { compact?: boolean }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`bg-white p-${compact ? '1' : '2'} border border-gray-200 rounded shadow-sm`}>
          <p className={`text-gray-700 font-medium text-${compact ? 'xs' : 'sm'} mb-1`}>{label}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center">
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: p.color }}
              />
              <p className={`text-${compact ? 'xs' : 'sm'} text-gray-600`}>
                {p.name}: <span className="font-medium">{p.value}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: compact ? 5 : 20,
            right: compact ? 10 : 30,
            left: compact ? 10 : 20,
            bottom: compact ? 5 : 20,
          }}
          barSize={compact ? 10 : 20}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            fontSize={compact ? 8 : 12}
            tick={{ fill: '#666' }}
            tickLine={{ stroke: '#ccc' }}
            axisLine={{ stroke: '#ccc' }}
          />
          <YAxis 
            fontSize={compact ? 8 : 12}
            tick={{ fill: '#666' }}
            tickLine={{ stroke: '#ccc' }}
            axisLine={{ stroke: '#ccc' }}
          />
          <Tooltip 
            content={<CustomTooltip compact={compact} />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: compact ? 8 : 12 }}
            iconSize={compact ? 8 : 14}
          />
          <Bar dataKey="demandas" name="Demandas" fill="#3b82f6" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name, 0)} />
            ))}
          </Bar>
          <Bar dataKey="notas" name="Notas" fill="#f97316" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name, 1)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroupedBarChart;
