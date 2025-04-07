
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  nome_completo: string;
  email: string;
  cargo?: string;
  departamento?: string;
}

export const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            id,
            nome_completo,
            email,
            cargo:cargo_id(descricao),
            coordenacao:coordenacao_id(descricao)
          `)
          .order('nome_completo');

        if (error) throw error;
        
        setProfiles(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching user profiles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  return { profiles, loading, error };
};

export default useUserProfiles;
