
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OriginDemandStatisticsProps {
  showComparison?: boolean;
}

// Sample data for the origin demand statistics
const data = [
  { name: 'Atendimento', count: 42, prevCount: 38, change: '+10%' },
  { name: 'Portal', count: 30, prevCount: 33, change: '-9%' },
  { name: 'e-SIC', count: 28, prevCount: 24, change: '+16%' },
  { name: 'Imprensa', count: 17, prevCount: 15, change: '+13%' },
  { name: 'Telefone', count: 14, prevCount: 18, change: '-22%' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const OriginDemandStatistics: React.FC<OriginDemandStatisticsProps> = ({ showComparison = false }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Origem das Demandas</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {showComparison ? (
          <div className="space-y-4">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" scale="point" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Bar dataKey="count" fill="#8884d8">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {data.map((item, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 p-2 rounded-lg flex flex-col" 
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-xs">{item.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.change.startsWith('+') ? 'bg-green-50 text-green-700' : 
                        item.change.startsWith('-') ? 'bg-red-50 text-red-700' : 'bg-gray-100'
                      }`}
                    >
                      {item.change.startsWith('+') ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {item.change}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" scale="point" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Bar dataKey="count" fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OriginDemandStatistics;
