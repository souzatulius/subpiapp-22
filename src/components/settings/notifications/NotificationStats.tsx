
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface NotificationStat {
  tipo: string;
  titulo: string;
  total_enviadas: number;
  total_lidas: number;
  porcentagem_leitura: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const NotificationStats: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<NotificationStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({
    total_notificacoes: 0,
    total_lidas: 0,
    taxa_leitura: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Obter estatísticas por tipo de notificação
      const { data: notificacoesData, error: notificacoesError } = await supabase
        .from('notificacoes')
        .select('tipo, lida')
        .not('tipo', 'is', null);
      
      if (notificacoesError) throw notificacoesError;
      
      if (!notificacoesData || notificacoesData.length === 0) {
        setStats([]);
        setTotals({
          total_notificacoes: 0,
          total_lidas: 0,
          taxa_leitura: 0
        });
        return;
      }
      
      // Obter configurações para mapear tipos para títulos
      const { data: configData, error: configError } = await supabase
        .from('configuracoes_notificacoes')
        .select('tipo, titulo');
      
      if (configError) throw configError;
      
      // Mapear tipo para título
      const tipoParaTitulo: Record<string, string> = {};
      if (configData) {
        configData.forEach(config => {
          tipoParaTitulo[config.tipo] = config.titulo;
        });
      }
      
      // Processar dados
      const tiposSet = new Set<string>();
      notificacoesData.forEach(n => {
        if (n.tipo) tiposSet.add(n.tipo);
      });
      
      const tiposArray = Array.from(tiposSet);
      
      // Calcular estatísticas por tipo
      const statsArray: NotificationStat[] = tiposArray.map(tipo => {
        const notificacoesDesseTipo = notificacoesData.filter(n => n.tipo === tipo);
        const totalEnviadas = notificacoesDesseTipo.length;
        const totalLidas = notificacoesDesseTipo.filter(n => n.lida).length;
        const porcentagemLeitura = totalEnviadas > 0 ? (totalLidas / totalEnviadas) * 100 : 0;
        
        return {
          tipo,
          titulo: tipoParaTitulo[tipo] || tipo,
          total_enviadas: totalEnviadas,
          total_lidas: totalLidas,
          porcentagem_leitura: porcentagemLeitura
        };
      });
      
      // Ordenar por maior número de notificações
      statsArray.sort((a, b) => b.total_enviadas - a.total_enviadas);
      
      // Calcular totais
      const totalNotificacoes = notificacoesData.length;
      const totalLidas = notificacoesData.filter(n => n.lida).length;
      const taxaLeitura = totalNotificacoes > 0 ? (totalLidas / totalNotificacoes) * 100 : 0;
      
      setStats(statsArray);
      setTotals({
        total_notificacoes: totalNotificacoes,
        total_lidas: totalLidas,
        taxa_leitura: taxaLeitura
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas de notificações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas de notificações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportToCsv = () => {
    try {
      if (stats.length === 0) {
        toast({
          title: "Exportação cancelada",
          description: "Não há dados para exportar.",
          variant: "destructive"
        });
        return;
      }
      
      // Criar cabeçalho CSV
      const headers = ['Tipo', 'Título', 'Total Enviadas', 'Total Lidas', 'Taxa de Leitura (%)'];
      
      // Criar linhas CSV
      const rows = stats.map(stat => [
        stat.tipo,
        stat.titulo,
        stat.total_enviadas,
        stat.total_lidas,
        stat.porcentagem_leitura.toFixed(1)
      ]);
      
      // Adicionar linha de totais
      rows.push([
        'TOTAIS',
        '',
        totals.total_notificacoes,
        totals.total_lidas,
        totals.taxa_leitura.toFixed(1)
      ]);
      
      // Converter para string CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Criar blob e link para download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `estatisticas_notificacoes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: "As estatísticas foram exportadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao exportar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar as estatísticas.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const statsPieData = stats.map(stat => ({
    name: stat.titulo,
    value: stat.total_enviadas
  }));

  const statsBarData = stats.map(stat => ({
    name: stat.titulo,
    enviadas: stat.total_enviadas,
    lidas: stat.total_lidas
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Estatísticas de Notificações</h3>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCsv}
            disabled={stats.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>
      
      {stats.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Sem dados disponíveis</h3>
            <p className="text-sm text-gray-500 mb-4">
              Nenhuma notificação foi enviada ainda ou os dados ainda não estão disponíveis.
            </p>
            <Button onClick={fetchStats} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total de Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.total_notificacoes}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Notificações Lidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.total_lidas}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Taxa de Leitura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(totals.taxa_leitura)}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Tipo</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statsPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} notificações`, 'Quantidade']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notificações Enviadas vs. Lidas</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statsBarData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="enviadas" name="Enviadas" fill="#8884d8" />
                    <Bar dataKey="lidas" name="Lidas" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabela de estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalhamento por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Total Enviadas</TableHead>
                    <TableHead>Total Lidas</TableHead>
                    <TableHead>Taxa de Leitura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.map((stat) => (
                    <TableRow key={stat.tipo}>
                      <TableCell className="font-medium">
                        <div>
                          {stat.titulo}
                          <div className="text-xs text-muted-foreground mt-1">
                            {stat.tipo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{stat.total_enviadas}</TableCell>
                      <TableCell>{stat.total_lidas}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            stat.porcentagem_leitura >= 80 ? 'default' : 
                            stat.porcentagem_leitura >= 50 ? 'secondary' : 
                            'outline'
                          }
                        >
                          {formatPercentage(stat.porcentagem_leitura)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NotificationStats;
