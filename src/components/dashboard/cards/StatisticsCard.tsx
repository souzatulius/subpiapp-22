
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatItem {
  name: string;
  value: number;
  color?: string;
}

interface StatisticsCardProps {
  data: StatItem[];
  title: string;
  chartType: 'bar' | 'pie' | 'line';
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatisticsCard: React.FC<StatisticsCardProps> = ({ data, title, chartType, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col space-y-4 p-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-40 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <Card className="h-full w-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <div className="h-[200px] w-full">
          {chartType === 'bar' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {chartType === 'pie' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
