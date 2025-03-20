
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

interface TransformedDataItem {
  name: string;
  [key: string]: string | number;
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  // Transform data for Recharts
  const transformedData: TransformedDataItem[] = data.labels.map((label, index) => {
    const item: TransformedDataItem = { name: label };
    data.datasets.forEach(dataset => {
      item[dataset.label] = dataset.data[index];
    });
    return item;
  });
  
  const config = data.datasets.reduce((acc, dataset) => {
    acc[dataset.label] = { color: dataset.borderColor || '#3b82f6' };
    return acc;
  }, {} as Record<string, { color: string }>);
  
  const generateLines = () => {
    return data.datasets.map((dataset, index) => (
      <Line
        key={index}
        type="monotone"
        dataKey={dataset.label}
        stroke={dataset.borderColor || '#3b82f6'}
        activeDot={{ r: 8 }}
        strokeWidth={2}
      />
    ));
  };
  
  return (
    <div className="w-full h-[240px]">
      <ChartContainer config={config}>
        <RechartsLineChart data={transformedData} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => value.toLocaleString()}
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
          {generateLines()}
        </RechartsLineChart>
      </ChartContainer>
    </div>
  );
};

export default LineChart;
