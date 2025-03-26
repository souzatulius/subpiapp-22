
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
    notifications: 0,
    usuarios: 0,
    supervisoesTecnicas: 0,
    coordenacoes: 0,
    cargos: 0,
    problemas: 0,
    tiposMidia: 0,
    origensDemanda: 0,
    distritos: 0,
    bairros: 0,
    comunicados: 0,
    configuracoesNotificacoes: 0,
    permissoes: 0,
    temas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetchStats();
    return () => {
      // Cleanup
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch supervisions count (is_supervision = true)
      const { data: supervisions, error: supervisionsError } = await supabase
        .from('areas_coordenacao')
        .select('id')
        .eq('is_supervision', true);
      
      if (supervisionsError) throw supervisionsError;
      
      // Fetch coordinations count (is_supervision = false)
      const { data: coordinations, error: coordinationsError } = await supabase
        .from('areas_coordenacao')
        .select('id')
        .eq('is_supervision', false);
      
      if (coordinationsError) throw coordinationsError;

      console.log('Fetched supervisions:', supervisions?.length);
      console.log('Fetched coordinations:', coordinations?.length);

      // Fetch counts for other entities
      const { data: positions, error: positionsError } = await supabase
        .from('cargos')
        .select('id');
      
      if (positionsError) throw positionsError;
      
      const { data: problems, error: problemsError } = await supabase
        .from('problemas')
        .select('id');
      
      if (problemsError) throw problemsError;
      
      const { data: mediaTypes, error: mediaTypesError } = await supabase
        .from('tipos_midia')
        .select('id');
      
      if (mediaTypesError) throw mediaTypesError;
      
      const { data: demandOrigins, error: demandOriginsError } = await supabase
        .from('origens_demandas')
        .select('id');
      
      if (demandOriginsError) throw demandOriginsError;
      
      const { data: districts, error: districtsError } = await supabase
        .from('distritos')
        .select('id');
      
      if (districtsError) throw districtsError;
      
      const { data: neighborhoods, error: neighborhoodsError } = await supabase
        .from('bairros')
        .select('id');
      
      if (neighborhoodsError) throw neighborhoodsError;
      
      const { data: announcements, error: announcementsError } = await supabase
        .from('comunicados')
        .select('id');
      
      if (announcementsError) throw announcementsError;
      
      const { data: users, error: usersError } = await supabase
        .from('usuarios')
        .select('id');
      
      if (usersError) throw usersError;
      
      const { data: permissions, error: permissionsError } = await supabase
        .from('permissoes')
        .select('id');
      
      if (permissionsError) throw permissionsError;
      
      const { data: themes, error: themesError } = await supabase
        .from('problemas')
        .select('id');
      
      if (themesError) throw themesError;
      
      const { data: notifications, error: notificationsError } = await supabase
        .from('notificacoes')
        .select('id');
      
      if (notificationsError) throw notificationsError;
      
      const { data: unreadNotifs, error: unreadNotifsError } = await supabase
        .from('notificacoes')
        .select('id')
        .eq('lida', false);
      
      if (unreadNotifsError) throw unreadNotifsError;
      
      const { data: notificationSettings, error: notificationSettingsError } = await supabase
        .from('configuracoes_notificacoes')
        .select('id');
      
      if (notificationSettingsError) throw notificationSettingsError;
      
      // Update the stats
      setStats({
        users: users?.length || 0,
        areas: supervisions?.length || 0,
        positions: positions?.length || 0,
        services: 0, // Will be updated in a more complex query if needed
        districts: districts?.length || 0,
        neighborhoods: neighborhoods?.length || 0,
        announcements: announcements?.length || 0,
        notifications: notifications?.length || 0,
        usuarios: users?.length || 0,
        supervisoesTecnicas: supervisions?.length || 0,
        coordenacoes: coordinations?.length || 0,
        cargos: positions?.length || 0,
        problemas: problems?.length || 0,
        tiposMidia: mediaTypes?.length || 0,
        origensDemanda: demandOrigins?.length || 0,
        distritos: districts?.length || 0,
        bairros: neighborhoods?.length || 0,
        comunicados: announcements?.length || 0,
        configuracoesNotificacoes: notificationSettings?.length || 0,
        permissoes: permissions?.length || 0,
        temas: themes?.length || 0
      });
      
      setUnreadNotifications(unreadNotifs?.length || 0);
    } catch (error) {
      console.error('Error fetching settings stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    unreadNotifications,
    refreshStats: fetchStats
  };
};
