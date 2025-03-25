
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
    // Additional properties for Portuguese UI
    usuarios: 0,
    areasCoordenacao: 0,
    coordenacoes: 0,
    cargos: 0,
    problemas: 0,
    temas: 0,
    tiposMidia: 0,
    origensDemanda: 0,
    distritos: 0,
    bairros: 0,
    comunicados: 0,
    configuracoesNotificacoes: 0,
    permissoes: 0
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
      }, {
        count: temasCount
      }, {
        count: tiposMidiaCount
      }, {
        count: origensDemandaCount
      }] = await Promise.all([
        supabase.from('usuarios').select('*', { count: 'exact', head: true }),
        supabase.from('areas_coordenacao').select('*', { count: 'exact', head: true }),
        supabase.from('cargos').select('*', { count: 'exact', head: true }),
        supabase.from('servicos').select('*', { count: 'exact', head: true }),
        supabase.from('distritos').select('*', { count: 'exact', head: true }),
        supabase.from('bairros').select('*', { count: 'exact', head: true }),
        supabase.from('comunicados').select('*', { count: 'exact', head: true }),
        supabase.from('notificacoes').select('*', { count: 'exact', head: true }),
        supabase.from('notificacoes').select('*', { count: 'exact', head: true }).eq('lida', false),
        supabase.from('problemas').select('*', { count: 'exact', head: true }),
        supabase.from('tipos_midia').select('*', { count: 'exact', head: true }),
        supabase.from('origens_demandas').select('*', { count: 'exact', head: true })
      ]);
      
      // Count coordenacoes based on distinct values in areas_coordenacao table
      const { data: coordenacoesData } = await supabase
        .from('areas_coordenacao')
        .select('coordenacao')
        .not('coordenacao', 'is', null);
      
      const coordenacoesCount = coordenacoesData ? 
        new Set(coordenacoesData.map(item => item.coordenacao).filter(Boolean)).size : 0;
      
      setStats({
        // English properties
        users: usersCount || 0,
        areas: areasCount || 0,
        positions: positionsCount || 0,
        services: servicesCount || 0,
        districts: districtsCount || 0,
        neighborhoods: neighborhoodsCount || 0,
        announcements: announcementsCount || 0,
        notifications: notificationsCount || 0,
        
        // Portuguese UI properties
        usuarios: usersCount || 0,
        areasCoordenacao: areasCount || 0,
        coordenacoes: coordenacoesCount || 0,
        cargos: positionsCount || 0,
        problemas: temasCount || 0,
        temas: temasCount || 0,
        tiposMidia: tiposMidiaCount || 0,
        origensDemanda: origensDemandaCount || 0,
        distritos: districtsCount || 0,
        bairros: neighborhoodsCount || 0,
        comunicados: announcementsCount || 0,
        configuracoesNotificacoes: notificationsCount || 0,
        permissoes: 0  // This might need to come from another table
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
