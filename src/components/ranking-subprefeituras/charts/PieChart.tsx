
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Cell } from 'recharts';

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

interface TransformedDataItem {
  name: string;
  value: number;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Transform data for Recharts
  const transformedData: TransformedDataItem[] = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index]
  }));
  
  const config = data.labels.reduce((acc, label, index) => {
    acc[label] = { color: data.datasets[0].backgroundColor[index] || '#d1d5db' };
    return acc;
  }, {} as Record<string, { color: string }>);
  
  return (
    <div className="w-full h-[240px]">
      <ChartContainer config={config}>
        <RechartsPieChart margin={{ top: 5, right: 5, bottom: 40, left: 5 }}>
          <Pie
            data={transformedData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={80}
            paddingAngle={1}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
            labelLine={false}
          >
            {transformedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={data.datasets[0].backgroundColor[index % data.datasets[0].backgroundColor.length]} 
              />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                formatter={(value) => value.toLocaleString()}
              />
            )}
          />
          <ChartLegend 
            content={({ payload }) => (
              <ChartLegendContent
                payload={payload?.slice(0, 5)} // Show only top 5 in legend
                verticalAlign="bottom"
              />
            )}
          />
        </RechartsPieChart>
      </ChartContainer>
    </div>
  );
};

export default PieChart;
