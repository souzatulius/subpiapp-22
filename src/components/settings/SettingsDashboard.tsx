import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowUpRight, Briefcase, Map, FileText, MessageSquare, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const SettingsDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    areas: 0,
    positions: 0,
    services: 0,
    districts: 0,
    neighborhoods: 0,
    announcements: 0,
    notifications: 0
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [{
          count: usersCount
        }, {
          count: areasCount
        }, {
          count: positionsCount
        }, {
          count: servicesCount
        }, {
          count: districtsCount
        }, {
          count: neighborhoodsCount
        }, {
          count: announcementsCount
        }, {
          count: notificationsCount
        }] = await Promise.all([supabase.from('usuarios').select('*', {
          count: 'exact',
          head: true
        }), supabase.from('areas_coordenacao').select('*', {
          count: 'exact',
          head: true
        }), supabase.from('cargos').select('*', {
          count: 'exact',
          head: true
        }), supabase.from('servicos').select('*', {
          count: 'exact',
          head: true
        }), supabase.from('distritos').select('*', {
          count: 'exact',
          head: true
        }), supabase.from('bairros').select('*', {
          count: 'exact',
          head: true
        }), supabase.from('comunicados').select('*', {
          count: 'exact',
          head: true
        }), supabase.from('notificacoes').select('*', {
          count: 'exact',
          head: true
        })]);
        setStats({
          users: usersCount || 0,
          areas: areasCount || 0,
          positions: positionsCount || 0,
          services: servicesCount || 0,
          districts: districtsCount || 0,
          neighborhoods: neighborhoodsCount || 0,
          announcements: announcementsCount || 0,
          notifications: notificationsCount || 0
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);
  const StatCard = ({
    title,
    value,
    icon,
    description
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
  }) => <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? '...' : value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>;
  return <div className="space-y-6">
      <h2 className="text-xl font-semibold">Visão Geral da Plataforma</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Usuários" value={stats.users} icon={<Users className="h-4 w-4 text-muted-foreground" />} description="Total de usuários cadastrados" />
        <StatCard title="Áreas de Coordenação" value={stats.areas} icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />} description="Áreas de coordenação registradas" />
        <StatCard title="Cargos" value={stats.positions} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} description="Tipos de cargos disponíveis" />
        <StatCard title="Serviços" value={stats.services} icon={<FileText className="h-4 w-4 text-muted-foreground" />} description="Serviços registrados" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Distritos" value={stats.districts} icon={<Map className="h-4 w-4 text-muted-foreground" />} description="Distritos registrados" />
        <StatCard title="Bairros" value={stats.neighborhoods} icon={<Map className="h-4 w-4 text-muted-foreground" />} description="Bairros cadastrados" />
        <StatCard title="Comunicados" value={stats.announcements} icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} description="Comunicados enviados" />
        <StatCard title="Notificações" value={stats.notifications} icon={<Bell className="h-4 w-4 text-muted-foreground" />} description="Notificações geradas" />
      </div>
      
      
    </div>;
};
export default SettingsDashboard;