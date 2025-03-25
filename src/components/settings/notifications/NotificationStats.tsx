import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Bell, UserCheck, UserX, BarChart3 } from "lucide-react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addDays, format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

interface NotificationStat {
  tipo: string;
  count: number;
}

interface UserStat {
  usuario_nome: string;
  count: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

const NotificationStats: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [typeStats, setTypeStats] = useState<NotificationStat[]>([]);
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [readStats, setReadStats] = useState<{read: number, unread: number}>({read: 0, unread: 0});
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [selectedTab, setSelectedTab] = useState('tipos');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchStats();
  }, [dateRange, selectedPeriod]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Format dates for query
      const from = dateRange.from.toISOString();
      const to = dateRange.to.toISOString();
      
      // Fetch type stats
      const { data: typeData, error: typeError } = await supabase
        .rpc('get_notification_type_stats', { 
          from_date: from,
          to_date: to
        });
      
      if (typeError) throw typeError;
      setTypeStats(typeData || []);
      
      // Fetch user stats
      const { data: userData, error: userError } = await supabase
        .rpc('get_notification_user_stats', { 
          from_date: from,
          to_date: to
        });
      
      if (userError) throw userError;
      setUserStats(userData || []);
      
      // Fetch read/unread stats
      const { data: readData, error: readError } = await supabase
        .rpc('get_notification_read_stats', { 
          from_date: from,
          to_date: to
        });
      
      if (readError) throw readError;
      if (readData && readData.length > 0) {
        const read = readData.find((item: any) => item.lida === true)?.count || 0;
        const unread = readData.find((item: any) => item.lida === false)?.count || 0;
        setReadStats({ read, unread });
      }
      
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas de notificações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    const today = new Date();
    
    switch (value) {
      case '7d':
        setDateRange({
          from: subDays(today, 7),
          to: today
        });
        break;
      case '30d':
        setDateRange({
          from: subDays(today, 30),
          to: today
        });
        break;
      case '90d':
        setDateRange({
          from: subDays(today, 90),
          to: today
        });
        break;
      case 'custom':
        // When selecting custom, keep the current date range
        break;
    }
  };

  const renderTypesChart = () => {
    if (typeStats.length === 0) return <div className="text-center py-10 text-gray-500">Sem dados para exibir</div>;
    
    const data: ChartData = {
      labels: typeStats.map(item => getNotificationType(item.tipo)),
      datasets: [
        {
          label: 'Quantidade',
          data: typeStats.map(item => item.count),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    return <Bar 
      data={data} 
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Notificações por Tipo',
          },
        },
      }} 
    />;
  };

  const renderUsersChart = () => {
    if (userStats.length === 0) return <div className="text-center py-10 text-gray-500">Sem dados para exibir</div>;
    
    // Limit to top 10 users for better visualization
    const topUsers = userStats.slice(0, 10);
    
    const data: ChartData = {
      labels: topUsers.map(item => item.usuario_nome),
      datasets: [
        {
          label: 'Notificações Recebidas',
          data: topUsers.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    return <Bar 
      data={data} 
      options={{
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Top 10 Usuários - Notificações Recebidas',
          },
        },
      }} 
    />;
  };

  const renderReadUnreadChart = () => {
    if (readStats.read === 0 && readStats.unread === 0) {
      return <div className="text-center py-10 text-gray-500">Sem dados para exibir</div>;
    }
    
    const data = {
      labels: ['Lidas', 'Não Lidas'],
      datasets: [
        {
          data: [readStats.read, readStats.unread],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    return <div className="max-w-[300px] mx-auto">
      <Pie 
        data={data} 
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Status das Notificações',
            },
          },
        }} 
      />
    </div>;
  };

  const getNotificationType = (type: string) => {
    switch (type) {
      case 'demanda_criada':
        return 'Nova Demanda';
      case 'demanda_respondida':
        return 'Demanda Respondida';
      case 'nota_pendente_aprov':
        return 'Nota Pendente';
      case 'nota_aprovada':
        return 'Nota Aprovada';
      case 'comunicado':
        return 'Comunicado';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select
                  value={selectedPeriod}
                  onValueChange={handlePeriodChange}
                >
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="custom">Período Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedPeriod === 'custom' && (
              <div className="w-full md:w-2/3">
                <div className="space-y-2">
                  <Label>Intervalo de datas</Label>
                  <DatePickerWithRange
                    value={dateRange}
                    onChange={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="tipos" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Tipos
                </TabsTrigger>
                <TabsTrigger value="usuarios" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger value="status" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Status
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tipos" className="h-[400px] flex items-center justify-center">
                {renderTypesChart()}
              </TabsContent>
              
              <TabsContent value="usuarios" className="h-[400px] flex items-center justify-center">
                {renderUsersChart()}
              </TabsContent>
              
              <TabsContent value="status" className="h-[400px] flex items-center justify-center">
                {renderReadUnreadChart()}
              </TabsContent>
            </Tabs>
            
            <div className="text-center text-sm text-gray-500">
              {selectedPeriod === 'custom' 
                ? `Período: ${format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} a ${format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}`
                : selectedPeriod === '7d'
                  ? 'Últimos 7 dias'
                  : selectedPeriod === '30d'
                    ? 'Últimos 30 dias'
                    : 'Últimos 90 dias'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationStats;
