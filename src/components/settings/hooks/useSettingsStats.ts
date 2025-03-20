
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SettingsStats } from '../types/settingsTypes';

export const useSettingsStats = () => {
  const [stats, setStats] = useState<SettingsStats>({
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
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  const fetchStats = async () => {
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
      }, {
        count: unreadNotificationsCount
      }] = await Promise.all([
        supabase.from('usuarios').select('*', { count: 'exact', head: true }),
        supabase.from('areas_coordenacao').select('*', { count: 'exact', head: true }),
        supabase.from('cargos').select('*', { count: 'exact', head: true }),
        supabase.from('servicos').select('*', { count: 'exact', head: true }),
        supabase.from('distritos').select('*', { count: 'exact', head: true }),
        supabase.from('bairros').select('*', { count: 'exact', head: true }),
        supabase.from('comunicados').select('*', { count: 'exact', head: true }),
        supabase.from('notificacoes').select('*', { count: 'exact', head: true }),
        supabase.from('notificacoes').select('*', { count: 'exact', head: true }).eq('lida', false)
      ]);
      
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
      
      setUnreadNotifications(unreadNotificationsCount || 0);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  
  return {
    stats,
    loading,
    unreadNotifications,
    fetchStats
  };
};
