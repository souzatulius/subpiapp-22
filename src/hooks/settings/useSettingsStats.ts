
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  usersCount: number;
  pendingApprovalCount: number;
  servicesCount: number;
  areasCount: number;
  coordinationsCount: number;
  mediaTypesCount: number;
  rolesCount: number;
  districtsCount: number;
  neighborhoodsCount: number;
  demandOriginsCount: number;
  problemsCount: number;
  notificationsCount: number;
  announcementsCount: number;
}

export function useSettingsStats() {
  const [stats, setStats] = useState<StatsData>({
    usersCount: 0,
    pendingApprovalCount: 0,
    servicesCount: 0,
    areasCount: 0,
    coordinationsCount: 0,
    mediaTypesCount: 0,
    rolesCount: 0,
    districtsCount: 0,
    neighborhoodsCount: 0,
    demandOriginsCount: 0,
    problemsCount: 0,
    notificationsCount: 0,
    announcementsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        // Fetch pending approval count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
          
        // Fetch services count
        const { count: servicesCount, error: servicesError } = await supabase
          .from('servicos')
          .select('*', { count: 'exact', head: true });
          
        // Fetch areas count
        const { count: areasCount, error: areasError } = await supabase
          .from('supervisoes_tecnicas')
          .select('*', { count: 'exact', head: true });
          
        // Fetch coordinations count
        const { count: coordCount, error: coordError } = await supabase
          .from('coordenacoes')
          .select('*', { count: 'exact', head: true });
          
        // Fetch roles count
        const { count: rolesCount, error: rolesError } = await supabase
          .from('cargos')
          .select('*', { count: 'exact', head: true });
          
        // Fetch other counts as needed
        
        if (usersError || pendingError || servicesError || areasError || coordError || rolesError) {
          throw new Error('Error fetching stats');
        }
        
        setStats({
          usersCount: usersCount || 0,
          pendingApprovalCount: pendingCount || 0,
          servicesCount: servicesCount || 0,
          areasCount: areasCount || 0,
          coordinationsCount: coordCount || 0,
          rolesCount: rolesCount || 0,
          mediaTypesCount: 0, // Add fetching logic
          districtsCount: 0, // Add fetching logic
          neighborhoodsCount: 0, // Add fetching logic
          demandOriginsCount: 0, // Add fetching logic
          problemsCount: 0, // Add fetching logic
          notificationsCount: 0, // Add fetching logic
          announcementsCount: 0 // Add fetching logic
        });
      } catch (err: any) {
        console.error('Error fetching settings stats:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return { stats, loading, error };
}
