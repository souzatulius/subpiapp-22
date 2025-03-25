
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export interface ChartDataItem {
  name: string;
  value: number;
}

interface MiniBarChartProps {
  data: ChartDataItem[];
  color?: string;
  height?: number;
}

const MiniBarChart: React.FC<MiniBarChartProps> = ({ 
  data, 
  color = "#3b82f6", 
  height = 100 
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ChartContainer
        config={{
          bar: {
            color,
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              className="fill-[--color-bar]"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MiniBarChart;
