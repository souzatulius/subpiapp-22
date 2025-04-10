
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupervisaoTecnica {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
}

export const useSupervisoesTecnicas = () => {
  const [supervisoesTecnicas, setSupervisoesTecnicas] = useState<SupervisaoTecnica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSupervisoesTecnicas = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('supervisoes_tecnicas')
          .select('id, descricao, sigla, coordenacao_id')
          .order('descricao');
          
        if (error) throw error;
        
        setSupervisoesTecnicas(data || []);
      } catch (err) {
        console.error('Error fetching supervisoes_tecnicas:', err);
        setError(err as Error);
        // Provide some default data as fallback
        setSupervisoesTecnicas([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupervisoesTecnicas();
  }, []);

  return { supervisoesTecnicas, isLoading, error };
};
