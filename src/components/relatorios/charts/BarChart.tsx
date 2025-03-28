
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartProps {
  data: Array<Record<string, any>>;
  title: string;
  xAxisDataKey: string;
  bars: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  className?: string;
  insight?: string;
  horizontal?: boolean;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  xAxisDataKey, 
  bars, 
  className,
  insight,
  horizontal = false,
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
            <RechartsBarChart
              data={data}
              layout={horizontal ? 'vertical' : 'horizontal'}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {horizontal ? (
                <>
                  <XAxis type="number" />
                  <YAxis dataKey={xAxisDataKey} type="category" />
                </>
              ) : (
                <>
                  <XAxis dataKey={xAxisDataKey} />
                  <YAxis />
                </>
              )}
              <Tooltip />
              <Legend />
              {bars.map((bar, index) => (
                <Bar 
                  key={index} 
                  dataKey={bar.dataKey} 
                  name={bar.name} 
                  fill={bar.color} 
                  stackId={stacked ? "stack" : undefined} 
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
