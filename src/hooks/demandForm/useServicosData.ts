
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useServicosData = () => {
  const [servicos, setServicos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServicos = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('servicos')
          .select('*')
          .order('descricao', { ascending: true });

        if (error) throw error;
        setServicos(data || []);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicos();
  }, []);

  return { servicos, isLoading, error };
};
