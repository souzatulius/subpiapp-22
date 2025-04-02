
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { UserProfile } from '@/types/common';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          id,
          nome_completo,
          email,
          cargo_id,
          coordenacao_id,
          supervisao_tecnica_id,
          whatsapp,
          aniversario,
          foto_perfil_url,
          cargos:cargo_id (descricao),
          coordenacoes:coordenacao_id (descricao),
          supervisoes_tecnicas:supervisao_tecnica_id (descricao)
        `)
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // Transform the data to match the UserProfile interface
      const transformedData: UserProfile = {
        id: data.id,
        nome_completo: data.nome_completo || '',
        email: data.email,
        cargo_id: data.cargo_id,
        coordenacao_id: data.coordenacao_id,
        supervisao_tecnica_id: data.supervisao_tecnica_id,
        whatsapp: data.whatsapp || '',
        aniversario: data.aniversario,
        foto_perfil_url: data.foto_perfil_url,
        cargo: data.cargos?.descricao,
        coordenacao: data.coordenacoes?.descricao,
        supervisao_tecnica: data.supervisoes_tecnicas?.descricao
      };
      
      setUserProfile(transformedData);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Listen for changes to the profile
  useEffect(() => {
    fetchUserProfile();
    
    // Listen for storage events as a way to trigger profile refreshes
    const handleStorageChange = () => {
      fetchUserProfile();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up a subscription to real-time changes on the user's profile
    let subscription: any;
    
    if (user?.id) {
      subscription = supabase
        .channel('profile-changes')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'usuarios',
          filter: `id=eq.${user.id}`
        }, () => {
          fetchUserProfile();
        })
        .subscribe();
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [fetchUserProfile, user?.id]);

  const refreshUserProfile = useCallback(async (): Promise<void> => {
    return fetchUserProfile();
  }, [fetchUserProfile]);

  return { userProfile, isLoading, error, refreshUserProfile };
};
