
import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AreaChartProps {
  data: Array<Record<string, any>>;
  title: string;
  xAxisDataKey: string;
  areas: Array<{
    dataKey: string;
    name: string;
    color: string;
    fillOpacity?: number;
  }>;
  className?: string;
  insight?: string;
  stacked?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  title, 
  xAxisDataKey, 
  areas, 
  className,
  insight,
  stacked = false
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {insight && <p className="text-sm text-muted-foreground">{insight}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisDataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {areas.map((area, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={area.dataKey}
                  name={area.name}
                  stroke={area.color}
                  fill={area.color}
                  fillOpacity={area.fillOpacity || 0.3}
                  stackId={stacked ? "stack" : undefined}
                />
              ))}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
