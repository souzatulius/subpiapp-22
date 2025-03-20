
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor?: string[];
      label?: string;
    }[];
  };
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Handle empty or invalid data
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="w-full h-[240px] flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Sem dados disponíveis</p>
      </div>
    );
  }

  // Transform data for Recharts
  const transformedData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0]?.data[index] || 0
  }));
  
  // Set default colors if backgroundColor is undefined
  const defaultColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'];
  const barColors = data.datasets[0]?.backgroundColor || defaultColors;
  
  // Create configuration for chart tooltip and legend
  const config = {
    value: { 
      color: barColors[0] || '#3b82f6'
    }
  };
  
  return (
    <div className="w-full h-[240px]">
      <ChartContainer config={config}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={transformedData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              height={40}
              tickMargin={10}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              allowDecimals={false}
            />
            <Bar 
              dataKey="value" 
              fill={barColors[0] || '#3b82f6'} 
              radius={[4, 4, 0, 0]}
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
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default BarChart;
