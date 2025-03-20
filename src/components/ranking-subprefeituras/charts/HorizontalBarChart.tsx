
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface HorizontalBarChartProps {
  data: {
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

interface TransformedDataItem {
  name: string;
  value: number;
  fill: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data }) => {
  // Transform data for Recharts
  const transformedData: TransformedDataItem[] = data.datasets.map((dataset, index) => ({
    name: dataset.label,
    value: dataset.data[0],
    fill: dataset.backgroundColor[0]
  }));
  
  const config = transformedData.reduce((acc, item) => {
    acc[item.name] = { color: item.fill || '#d1d5db' };
    return acc;
  }, {} as Record<string, { color: string }>);
  
  return (
    <div className="w-full h-[240px]">
      <ChartContainer config={config}>
        <RechartsBarChart 
          data={transformedData} 
          layout="vertical"
          margin={{ top: 10, right: 10, bottom: 10, left: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis 
            type="category"
            dataKey="name" 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            width={120}
          />
          <ChartTooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                formatter={(value) => value.toLocaleString()}
              />
            )}
          />
          <Bar 
            dataKey="value" 
            background={{ fill: '#f9fafb' }}
            radius={[0, 4, 4, 0]}
          />
        </RechartsBarChart>
      </ChartContainer>
    </div>
  );
};

export default HorizontalBarChart;
