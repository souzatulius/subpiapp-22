
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface GroupedBarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

interface TransformedDataItem {
  name: string;
  [key: string]: string | number;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data }) => {
  // Transform data for Recharts
  const transformedData: TransformedDataItem[] = data.labels.map((label, index) => {
    const item: TransformedDataItem = { name: label };
    data.datasets.forEach(dataset => {
      item[dataset.label] = dataset.data[index];
    });
    return item;
  });
  
  const config = data.datasets.reduce((acc, dataset) => {
    acc[dataset.label] = { color: dataset.backgroundColor || '#d1d5db' };
    return acc;
  }, {} as Record<string, { color: string }>);
  
  return (
    <div className="w-full h-[240px]">
      <ChartContainer config={config}>
        <RechartsBarChart 
          data={transformedData} 
          margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
        >
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
          {data.datasets.map((dataset, index) => (
            <Bar
              key={index}
              dataKey={dataset.label}
              fill={dataset.backgroundColor || '#3b82f6'}
              radius={[4, 4, 0, 0]}
            />
          ))}
          <ChartLegend 
            content={({ payload }) => (
              <ChartLegendContent
                payload={payload}
                verticalAlign="top"
              />
            )}
          />
        </RechartsBarChart>
      </ChartContainer>
    </div>
  );
};

export default GroupedBarChart;
