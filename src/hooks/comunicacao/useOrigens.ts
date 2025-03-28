
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Origem {
  id: string;
  descricao: string;
}

export const useOrigens = () => {
  const [origens, setOrigens] = useState<Origem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrigens = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('origens_demandas')
          .select('*')
          .order('descricao', { ascending: true });

        if (error) throw error;
        
        setOrigens(data || []);
      } catch (error) {
        console.error('Error fetching origins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrigens();
  }, []);

  return { origens, isLoading };
};
