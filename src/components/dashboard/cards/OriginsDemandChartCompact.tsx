
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface OriginCountData {
  id: string;
  descricao: string;
  count: number;
  color: string;
}

interface OriginsDemandChartProps {
  className?: string;
  title?: string;
  subtitle?: string;
  color?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF6347'];

const OriginsDemandChartCompact: React.FC<OriginsDemandChartProps> = ({ 
  className = '', 
  title = 'Origem das Demandas',
  subtitle = 'Distribuição por fonte', 
  color = 'bg-blue-50' 
}) => {
  const [data, setData] = useState<OriginCountData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOriginData = async () => {
      try {
        setLoading(true);
        // First, get all origin descriptions
        const { data: origins, error: originsError } = await supabase
          .from('origens_demandas')
          .select('id, descricao');

        if (originsError) throw originsError;

        // Then get counts by origin_id
        const { data: counts, error: countsError } = await supabase
          .rpc('get_demandas_por_origem');

        if (countsError) throw countsError;
        
        // Map the counts to their descriptions and add colors
        const mappedData = origins
          .map((origin, index) => {
            const countEntry = counts.find(c => c.origem_id === origin.id);
            return {
              id: origin.id,
              descricao: origin.descricao,
              count: countEntry ? Number(countEntry.count) : 0,
              color: COLORS[index % COLORS.length]
            };
          })
          .filter(item => item.count > 0) // Only show items with counts
          .sort((a, b) => b.count - a.count); // Sort by count desc

        setData(mappedData);
      } catch (err) {
        console.error('Error fetching origin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOriginData();
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <span>{title}</span>
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="count"
                nameKey="descricao"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} demandas`, name]}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  padding: '8px'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{
                  fontSize: '10px', 
                  paddingTop: '10px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
            Não há dados disponíveis
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OriginsDemandChartCompact;
