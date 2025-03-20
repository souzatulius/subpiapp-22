
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

interface TransformedDataItem {
  name: string;
  [key: string]: string | number;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Transform data for Recharts
  const transformedData: TransformedDataItem[] = data.labels.map((label, index) => {
    const item: TransformedDataItem = { name: label };
    data.datasets.forEach(dataset => {
      item[dataset.label] = dataset.data[index];
    });
    return item;
  });
  
  const colorMap = data.datasets[0].backgroundColor.reduce((acc, color, index) => {
    acc[data.labels[index]] = color;
    return acc;
  }, {} as Record<string, string>);
  
  const config = data.labels.reduce((acc, label) => {
    acc[label] = { color: colorMap[label] || '#d1d5db' };
    return acc;
  }, {} as Record<string, { color: string }>);
  
  const generateBars = () => {
    return data.datasets.map((dataset, index) => (
      <Bar
        key={index}
        dataKey={dataset.label}
        fill={dataset.backgroundColor[0] || '#3b82f6'}
        background={{ fill: '#f9fafb' }}
        radius={[4, 4, 0, 0]}
      />
    ));
  };
  
  return (
    <div className="w-full h-[240px]">
      <ChartContainer config={config}>
        <RechartsBarChart data={transformedData} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            angle={-45}
            textAnchor="end"
            height={60}
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
          {generateBars()}
        </RechartsBarChart>
      </ChartContainer>
    </div>
  );
};

export default BarChart;
