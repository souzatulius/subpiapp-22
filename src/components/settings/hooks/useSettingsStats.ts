
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SettingsStats } from '../types/settingsTypes';

export const useSettingsStats = () => {
  const [stats, setStats] = useState<SettingsStats>({
    usuarios: 0,
    supervisoesTecnicas: 0,
    cargos: 0,
    problemas: 0,
    origens: 0,
    tiposMidia: 0,
    distritos: 0,
    bairros: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch counts from Supabase tables
        const [
          usuariosResult,
          supervisoesResult,
          cargosResult,
          problemasResult,
          origensResult,
          tiposMidiaResult,
          distritosResult,
          bairrosResult
        ] = await Promise.all([
          supabase.from('usuarios').select('id', { count: 'exact', head: true }),
          supabase.from('supervisoes_tecnicas').select('id', { count: 'exact', head: true }),
          supabase.from('cargos').select('id', { count: 'exact', head: true }),
          supabase.from('problemas').select('id', { count: 'exact', head: true }),
          supabase.from('origens_demandas').select('id', { count: 'exact', head: true }),
          supabase.from('tipos_midia').select('id', { count: 'exact', head: true }),
          supabase.from('distritos').select('id', { count: 'exact', head: true }),
          supabase.from('bairros').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          usuarios: usuariosResult.count || 0,
          supervisoesTecnicas: supervisoesResult.count || 0,
          cargos: cargosResult.count || 0,
          problemas: problemasResult.count || 0,
          origens: origensResult.count || 0,
          tiposMidia: tiposMidiaResult.count || 0,
          distritos: distritosResult.count || 0,
          bairros: bairrosResult.count || 0
        });
      } catch (error: any) {
        console.error('Error fetching settings stats:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
