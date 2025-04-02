
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

export interface DonutDataItem {
  name: string;
  value: number;
}

interface MiniDonutChartProps {
  data: DonutDataItem[];
  colors?: string[];
  height?: number;
}

const MiniDonutChart: React.FC<MiniDonutChartProps> = ({ 
  data, 
  colors = ["#0ea5e9", "#1e40af", "#f97316", "#71717a", "#27272a"], 
  height = 100
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ChartContainer
        config={{
          donut: {
            color: "#0ea5e9",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={40}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MiniDonutChart;
