import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface NotificationStat {
  tipo: string;
  count: number;
}

interface UserStat {
  usuario_nome: string;
  count: number;
}

interface ReadStat {
  lida: boolean;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const NotificationStats = () => {
  const [typeStats, setTypeStats] = useState<NotificationStat[]>([]);
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [readStats, setReadStats] = useState<{ lidas: number; naoLidas: number }>({ lidas: 0, naoLidas: 0 });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch notification stats by type
      const typeStatsResponse = await supabase
        .from('notificacoes')
        .select('tipo, count')
        .gte('data_envio', dateRange.from.toISOString())
        .lte('data_envio', dateRange.to.toISOString())
        .select('tipo, count(*)')
        .groupBy('tipo');

      if (typeStatsResponse.error) throw typeStatsResponse.error;
      setTypeStats(typeStatsResponse.data as NotificationStat[]);

      // Fetch notification stats by user
      const userStatsResponse = await supabase
        .from('notificacoes')
        .select('usuario_id, usuarios!inner(nome_completo), count(*)')
        .gte('data_envio', dateRange.from.toISOString())
        .lte('data_envio', dateRange.to.toISOString())
        .groupBy('usuario_id, usuarios.nome_completo');

      if (userStatsResponse.error) throw userStatsResponse.error;
      
      const formattedUserStats = userStatsResponse.data.map(item => ({
        usuario_nome: item.usuarios?.nome_completo || 'Desconhecido',
        count: parseInt(item.count)
      }));
      
      setUserStats(formattedUserStats);

      // Fetch notification stats by read status
      const readStatsResponse = await supabase
        .from('notificacoes')
        .select('lida, count(*)')
        .gte('data_envio', dateRange.from.toISOString())
        .lte('data_envio', dateRange.to.toISOString())
        .groupBy('lida');

      if (readStatsResponse.error) throw readStatsResponse.error;
      
      let lidas = 0;
      let naoLidas = 0;
      
      readStatsResponse.data.forEach((item: any) => {
        if (item.lida === true) {
          lidas = parseInt(item.count);
        } else {
          naoLidas = parseInt(item.count);
        }
      });
      
      setReadStats({ lidas, naoLidas });
    } catch (error) {
      console.error('Erro ao carregar estatísticas de notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (range: { from?: Date; to?: Date }) => {
    if (range.from && range.to) {
      setDateRange({
        from: range.from,
        to: range.to,
      });
    }
  };

  const toggleTypeFilter = (tipo: string) => {
    if (selectedTypes.includes(tipo)) {
      setSelectedTypes(selectedTypes.filter(t => t !== tipo));
    } else {
      setSelectedTypes([...selectedTypes, tipo]);
    }
  };

  const toggleUserFilter = (usuario: string) => {
    if (selectedUsers.includes(usuario)) {
      setSelectedUsers(selectedUsers.filter(u => u !== usuario));
    } else {
      setSelectedUsers([...selectedUsers, usuario]);
    }
  };

  const filteredTypeStats = selectedTypes.length
    ? typeStats.filter(stat => selectedTypes.includes(stat.tipo))
    : typeStats;

  const filteredUserStats = selectedUsers.length
    ? userStats.filter(stat => selectedUsers.includes(stat.usuario_nome))
    : userStats;

  const readStatsData = [
    { name: 'Lidas', value: readStats.lidas },
    { name: 'Não Lidas', value: readStats.naoLidas },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Estatísticas de Notificações</CardTitle>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
            <DatePickerWithRange
              dateRange={dateRange}
              onRangeChange={handleRangeChange}
            />
            <Button
              onClick={fetchStats}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Carregando...' : 'Atualizar'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="tipo">
        <TabsList className="w-full">
          <TabsTrigger value="tipo" className="flex-1">Por Tipo</TabsTrigger>
          <TabsTrigger value="usuario" className="flex-1">Por Usuário</TabsTrigger>
          <TabsTrigger value="leitura" className="flex-1">Por Leitura</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tipo">
          <Card>
            <CardHeader>
              <CardTitle>Notificações por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              {typeStats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum dado disponível para o período selecionado.
                </div>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {typeStats.map(stat => (
                      <Button
                        key={stat.tipo}
                        variant={selectedTypes.includes(stat.tipo) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTypeFilter(stat.tipo)}
                      >
                        {stat.tipo}
                      </Button>
                    ))}
                    {selectedTypes.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTypes([])}
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredTypeStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tipo" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [value, 'Notificações']}
                          labelFormatter={(label) => `Tipo: ${label}`}
                        />
                        <Bar dataKey="count" fill="#8884d8" name="Quantidade" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usuario">
          <Card>
            <CardHeader>
              <CardTitle>Notificações por Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              {userStats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum dado disponível para o período selecionado.
                </div>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {userStats.map(stat => (
                      <Button
                        key={stat.usuario_nome}
                        variant={selectedUsers.includes(stat.usuario_nome) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleUserFilter(stat.usuario_nome)}
                      >
                        {stat.usuario_nome}
                      </Button>
                    ))}
                    {selectedUsers.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUsers([])}
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredUserStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="usuario_nome" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [value, 'Notificações']}
                          labelFormatter={(label) => `Usuário: ${label}`}
                        />
                        <Bar dataKey="count" fill="#82ca9d" name="Quantidade" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leitura">
          <Card>
            <CardHeader>
              <CardTitle>Status de Leitura de Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              {readStats.lidas === 0 && readStats.naoLidas === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum dado disponível para o período selecionado.
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={readStatsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {readStatsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [value, 'Notificações']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-8 mt-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 bg-[#00C49F] rounded-sm"></div>
                      <span>Lidas: {readStats.lidas}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 bg-[#FF8042] rounded-sm"></div>
                      <span>Não Lidas: {readStats.naoLidas}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationStats;

