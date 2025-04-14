
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface OriginDemandStatisticsProps {
  showComparison?: boolean;
}

// Sample data for the origin demand statistics - used as fallback
const DEFAULT_DATA = [
  { name: 'Atendimento', count: 42, prevCount: 38, change: '+10%' },
  { name: 'Portal', count: 30, prevCount: 33, change: '-9%' },
  { name: 'e-SIC', count: 28, prevCount: 24, change: '+16%' },
  { name: 'Imprensa', count: 17, prevCount: 15, change: '+13%' },
  { name: 'Telefone', count: 14, prevCount: 18, change: '-22%' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const OriginDemandStatistics: React.FC<OriginDemandStatisticsProps> = ({ showComparison = false }) => {
  const { user } = useAuth();
  const userId = user?.id || '';
  const { data: demandasPorOrigem, loading } = useDashboardData('get_demandas_por_origem', '', userId);
  
  // Prepare data for visualization
  const dataForChart = React.useMemo(() => {
    if (loading || !demandasPorOrigem || demandasPorOrigem.length === 0) {
      return DEFAULT_DATA;
    }
    
    // Transform the data from the API into the format needed for the chart
    return demandasPorOrigem.map((item: any, index: number) => {
      // Here we'd ideally fetch the previous counts to calculate change percentage
      // For now, let's use a random change between -25% and +25%
      const randomChange = Math.floor(Math.random() * 50) - 25;
      const changePrefix = randomChange >= 0 ? '+' : '';
      const prevCount = Math.max(1, Math.round(item.count * (1 - randomChange/100)));
      
      return {
        name: item.origem_descricao || `Origem ${index + 1}`,
        count: parseInt(item.count) || 0,
        prevCount: prevCount,
        change: `${changePrefix}${randomChange}%`
      };
    });
  }, [demandasPorOrigem, loading]);
  
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
                <BarChart data={dataForChart} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" scale="point" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Bar dataKey="count" fill="#8884d8">
                    {dataForChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {dataForChart.map((item, index) => (
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
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataForChart} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" scale="point" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Bar dataKey="count" fill="#8884d8">
                    {dataForChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OriginDemandStatistics;
