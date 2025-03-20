
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
      backgroundColor?: string[];
    }[];
  };
}

interface TransformedDataItem {
  name: string;
  value: number;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Handle empty or invalid data
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="w-full h-[240px] flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Sem dados disponíveis</p>
      </div>
    );
  }
  
  // Default colors if backgroundColor is undefined
  const defaultColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f97316', '#eab308', '#22c55e'];
  const backgroundColors = data.datasets[0]?.backgroundColor || defaultColors;
  
  // Transform data for Recharts
  const transformedData: TransformedDataItem[] = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0]?.data[index] || 0
  })).filter(item => item.value > 0); // Only include items with values > 0
  
  // If no valid data after filtering
  if (transformedData.length === 0) {
    return (
      <div className="w-full h-[240px] flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Sem dados disponíveis</p>
      </div>
    );
  }
  
  const config = data.labels.reduce((acc, label, index) => {
    acc[label] = { color: backgroundColors[index % backgroundColors.length] || '#d1d5db' };
    return acc;
  }, {} as Record<string, { color: string }>);
  
  return (
    <div className="w-full h-[240px]">
      <ChartContainer config={config}>
        <ResponsiveContainer width="100%" height="100%">
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
                  fill={backgroundColors[index % backgroundColors.length]} 
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
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default PieChart;
