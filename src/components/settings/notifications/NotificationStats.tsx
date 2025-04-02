
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const NotificationStats = () => {
  const [notificationStats, setNotificationStats] = useState<any[]>([]);
  const [typeStats, setTypeStats] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [readRate, setReadRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    fetchNotificationStats();
  }, [timeframe]);

  const fetchNotificationStats = async () => {
    try {
      setIsLoading(true);
      
      // Get total count
      const { count: totalNotifications } = await supabase
        .from('notificacoes')
        .select('id', { count: 'exact' });
      
      // Get read/unread counts
      const { data: readData } = await supabase
        .from('notificacoes')
        .select('id', { count: 'exact' })
        .eq('lida', true);
      
      // Calculate read rate
      const readCount = readData?.length || 0;
      const calculatedReadRate = totalNotifications ? (readCount / totalNotifications) * 100 : 0;
      
      // Get notification counts by date (for the chart)
      const timeLimit = new Date();
      if (timeframe === 'week') {
        timeLimit.setDate(timeLimit.getDate() - 7);
      } else if (timeframe === 'month') {
        timeLimit.setMonth(timeLimit.getMonth() - 1);
      } else {
        timeLimit.setDate(timeLimit.getDate() - 30);
      }

      const { data: dailyData } = await supabase
        .from('notificacoes')
        .select('data_envio')
        .gte('data_envio', timeLimit.toISOString());

      // Get notification counts by type
      const { data: typeData } = await supabase
        .from('notificacoes')
        .select('tipo, referencia_tipo');

      // Process data for charts
      const processedTypeData = processTypeData(typeData || []);
      const processedDailyData = processDailyData(dailyData || [], timeframe);

      setNotificationStats(processedDailyData);
      setTypeStats(processedTypeData);
      setTotalCount(totalNotifications || 0);
      setReadRate(calculatedReadRate);
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process notification data by date
  const processDailyData = (data: any[], timeframe: string) => {
    const counts: Record<string, number> = {};
    
    // Initialize dates
    const now = new Date();
    const startDate = new Date();
    
    if (timeframe === 'week') {
      startDate.setDate(now.getDate() - 7);
      
      // Initialize all days of the week
      for (let i = 0; i <= 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toLocaleDateString('pt-BR');
        counts[dateStr] = 0;
      }
    } else {
      startDate.setMonth(now.getMonth() - 1);
      
      // Initialize all days of the month
      for (let i = 0; i <= 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        counts[dateStr] = 0;
      }
    }
    
    // Count notifications by date
    data.forEach(item => {
      const date = new Date(item.data_envio);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    
    // Convert to array of objects for the chart
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => {
      // Sort by date
      const [dayA, monthA] = a.date.split('/').map(Number);
      const [dayB, monthB] = b.date.split('/').map(Number);
      
      if (monthA !== monthB) {
        return monthA - monthB;
      }
      return dayA - dayB;
    });
  };

  // Process notification data by type
  const processTypeData = (data: any[]) => {
    const counts: Record<string, number> = {};
    
    data.forEach(item => {
      // Use referencia_tipo if available, otherwise fall back to tipo
      const type = item.referencia_tipo || item.tipo || 'outro';
      counts[type] = (counts[type] || 0) + 1;
    });
    
    // Convert to array of objects for the chart
    return Object.entries(counts).map(([name, value]) => ({
      name: getTypeName(name),
      value
    }));
  };
  
  const getTypeName = (type: string) => {
    switch (type) {
      case 'demanda_nova':
        return 'Demandas Novas';
      case 'demanda_atualizada':
        return 'Atualizações de Demandas';
      case 'nota_nova':
        return 'Notas Novas';
      case 'nota_aprovacao':
        return 'Aprovações de Notas';
      case 'comunicado':
        return 'Comunicados';
      case 'prazo_proximo':
        return 'Alertas de Prazo';
      default:
        return 'Outros';
    }
  };
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6347', '#808080'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Notificações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm text-gray-500">Carregando estatísticas...</p>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm text-gray-500">Total de Notificações</div>
                <div className="text-3xl font-bold">{totalCount}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm text-gray-500">Taxa de Leitura</div>
                <div className="text-3xl font-bold">{readRate.toFixed(1)}%</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm text-gray-500">Tipos Diferentes</div>
                <div className="text-3xl font-bold">{typeStats.length}</div>
              </div>
            </div>
            
            {/* Line chart - notifications over time */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Notificações ao Longo do Tempo</h3>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTimeframe('week')}
                    className={`px-2 py-1 text-sm rounded ${timeframe === 'week' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    7 dias
                  </button>
                  <button 
                    onClick={() => setTimeframe('month')}
                    className={`px-2 py-1 text-sm rounded ${timeframe === 'month' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    30 dias
                  </button>
                </div>
              </div>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={notificationStats}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Notificações"
                      stroke="#0088FE"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Pie chart - notification types */}
            <div>
              <h3 className="text-lg font-medium mb-4">Distribuição por Tipo</h3>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeStats}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationStats;
