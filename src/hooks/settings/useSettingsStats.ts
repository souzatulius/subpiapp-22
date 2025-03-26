
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SettingsStats } from '../../components/settings/types/settingsTypes';

export const useSettingsStats = () => {
  const [stats, setStats] = useState<SettingsStats>({
    users: 0,
    areas: 0,
    positions: 0,
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
    temas: 0,
    notificacoes: 0,
    servicos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch supervisions count
      const { data: supervisions, error: supervisionsError } = await supabase
        .from('areas_coordenacao')
        .select('id')
        .eq('is_supervision', true);
      
      if (supervisionsError) throw supervisionsError;
      
      // Fetch coordinations count
      const { data: coordinations, error: coordinationsError } = await supabase
        .from('coordenacoes')
        .select('id');
      
      if (coordinationsError) throw coordinationsError;

      // Fetch services count
      const { data: services, error: servicesError } = await supabase
        .from('servicos')
        .select('id');
      
      if (servicesError) throw servicesError;

      // Fetch other counts
      const tablesQueries = [
        { table: 'cargos', key: 'cargos' },
        { table: 'problemas', key: 'problemas' },
        { table: 'tipos_midia', key: 'tiposMidia' },
        { table: 'origens_demandas', key: 'origensDemanda' },
        { table: 'distritos', key: 'distritos' },
        { table: 'bairros', key: 'bairros' },
        { table: 'comunicados', key: 'comunicados' },
        { table: 'usuarios', key: 'usuarios' },
        { table: 'permissoes', key: 'permissoes' },
        { table: 'notificacoes', key: 'notificacoes' }
      ];

      const tablesData = await Promise.all(
        tablesQueries.map(async ({ table, key }) => {
          const { data, error } = await supabase
            .from(table)
            .select('id');
          
          if (error) throw error;
          return { key, count: data.length };
        })
      );

      // Prepare updated stats
      const updatedStats: SettingsStats = {
        ...stats,
        supervisoesTecnicas: supervisions?.length || 0,
        coordenacoes: coordinations?.length || 0,
        servicos: services?.length || 0,
        // Initialize all other properties to avoid TypeScript errors
        users: 0,
        areas: 0,
        positions: 0,
        districts: 0,
        neighborhoods: 0,
        announcements: 0,
        notifications: 0,
        usuarios: 0,
        cargos: 0,
        problemas: 0,
        tiposMidia: 0,
        origensDemanda: 0,
        distritos: 0,
        bairros: 0,
        comunicados: 0,
        configuracoesNotificacoes: 0,
        permissoes: 0,
        temas: 0,
        notificacoes: 0
      };

      // Update other counts dynamically
      tablesData.forEach(({ key, count }) => {
        updatedStats[key as keyof SettingsStats] = count;
      });

      setStats(updatedStats);
    } catch (error) {
      console.error('Error fetching settings stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    refreshStats: fetchStats
  };
};
