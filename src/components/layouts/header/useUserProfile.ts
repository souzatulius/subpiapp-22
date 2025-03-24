
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface UserProfile {
  nome_completo: string;
  cargo_id: string;
  problema_id: string;
  foto_perfil_url?: string;
  whatsapp?: string;
  aniversario?: string;
  cargos?: {
    descricao: string;
  };
  problemas?: {
    descricao: string;
  };
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          nome_completo,
          cargo_id,
          problema_id,
          foto_perfil_url,
          whatsapp,
          aniversario,
          cargos:cargo_id(descricao),
          problemas:problema_id(descricao)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Check if the data is valid before setting it
      if (data) {
        setUserProfile(data);
      } else {
        console.error('No profile data found for user');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Automatically fetch profile when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  return {
    userProfile,
    fetchUserProfile,
    loading
  };
};
