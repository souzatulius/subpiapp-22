
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge"
import { Circle } from 'lucide-react';

interface NotificationStatsProps {
  // Define any props if needed
}

const NotificationStats: React.FC<NotificationStatsProps> = () => {
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [readNotifications, setReadNotifications] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [coordenacoesData, setCoordenacoesData] = useState<any[]>([]);
  const [demandaStatusData, setDemandaStatusData] = useState<any[]>([]);
  const [origensData, setOrigensData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Total de notificações
      const { count: totalCount, error: totalError } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact' });

      if (totalError) throw totalError;
      setTotalNotifications(totalCount || 0);

      // Total de notificações lidas
      const { count: readCount, error: readError } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact' })
        .eq('lida', true);

      if (readError) throw readError;
      setReadNotifications(readCount || 0);

      // Total de notificações não lidas
      const { count: unreadCount, error: unreadError } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact' })
        .eq('lida', false);

      if (unreadError) throw unreadError;
      setUnreadNotifications(unreadCount || 0);

      const { data: coordenacoes, error: coordenacoesError } = await supabase
        .from('coordenacoes')
        .select('id, descricao');

      if (coordenacoesError) throw coordenacoesError;

      // Use this format for count queries:
      const { data: notificacoesCoordenacaoData, error: coordError } = await supabase
        .rpc('get_notificacoes_por_coordenacao');

      if (coordError) throw coordError;

      const coordenacoesMap: Record<string, string> = {};
      coordenacoes?.forEach(coord => {
        coordenacoesMap[coord.id] = coord.descricao;
      });

      const formattedCoordenacoesData = notificacoesCoordenacaoData?.map(item => ({
        name: coordenacoesMap[item.coordenacao_id] || 'Desconhecido',
        value: item.count,
      })) || [];

      setCoordenacoesData(formattedCoordenacoesData);

      // Use RPC function for status grouping instead of direct query with group
      const { data: demandasStatusData, error: statusError } = await supabase
        .rpc('get_demandas_por_status');

      if (statusError) throw statusError;

      const formattedDemandaStatusData = demandasStatusData?.map(item => ({
        name: item.status,
        value: item.count,
      })) || [];

      setDemandaStatusData(formattedDemandaStatusData);

      // Use RPC function for origens grouping
      const { data: demandasOrigensData, error: origensError } = await supabase
        .rpc('get_demandas_por_origem');

      if (origensError) throw origensError;

      const { data: origens, error: origensListError } = await supabase
        .from('origens_demandas')
        .select('id, descricao');

      if (origensListError) throw origensListError;

      const origensMap: Record<string, string> = {};
      origens?.forEach(origem => {
        origensMap[origem.id] = origem.descricao;
      });

      const formattedOrigensData = demandasOrigensData?.map(item => ({
        name: origensMap[item.origem_id] || 'Desconhecido',
        value: item.count,
      })) || [];

      setOrigensData(formattedOrigensData);

    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-col items-start justify-center">
        {payload.map(
          (entry: any, index: number) => (
            <li key={`item-${index}`} className="flex items-center py-1">
              <Circle color={entry.color} size={12} className="mr-2" />
              <span className="text-sm">{entry.value}</span>
            </li>
          )
        )}
      </ul>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card de Resumo */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Resumo de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Total de Notificações:</span>
                <Badge variant="secondary">{totalNotifications}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Notificações Lidas:</span>
                <Badge variant="outline">{readNotifications}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Notificações Não Lidas:</span>
                <Badge variant="destructive">{unreadNotifications}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Coordenações */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Notificações Não Lidas por Coordenação</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={coordenacoesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {coordenacoesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Status das Demandas */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Status das Demandas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demandaStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {demandaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Origens das Demandas */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Origens das Demandas Não Respondidas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={origensData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#ffc658"
                  label
                >
                  {origensData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationStats;
