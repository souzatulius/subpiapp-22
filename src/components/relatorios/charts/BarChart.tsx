
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface BarData {
  dataKey: string;
  name: string;
  color: string;
}

interface BarChartProps {
  data: any[];
  xAxisDataKey: string;
  bars: BarData[];
  showLegend?: boolean;
  multiColorBars?: boolean;
  barColors?: string[];
  horizontal?: boolean;
  tooltipFormatter?: (value: any, name: any, item: any) => any[];
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisDataKey,
  bars,
  showLegend = true,
  multiColorBars = false,
  barColors = ['#0066FF', '#0C4A6E', '#64748B', '#F97316'],
  horizontal = false,
  tooltipFormatter
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 30
        }}
        layout={horizontal ? 'vertical' : 'horizontal'}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={horizontal ? undefined : xAxisDataKey} 
          type={horizontal ? 'number' : 'category'}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
        />
        <YAxis 
          dataKey={horizontal ? xAxisDataKey : undefined}
          type={horizontal ? 'category' : 'number'}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            padding: '10px'
          }}
          labelStyle={{ fontWeight: 'bold' }}
          formatter={tooltipFormatter}
        />
        {showLegend && <Legend />}
        
        {bars.map((bar, index) => (
          <Bar 
            key={bar.dataKey} 
            dataKey={bar.dataKey}
            name={bar.name} 
            fill={bar.color}
            radius={[4, 4, 0, 0]}
          >
            {multiColorBars && data.map((_, dataIndex) => (
              <Cell 
                key={`cell-${dataIndex}`} 
                fill={barColors[dataIndex % barColors.length]} 
              />
            ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
