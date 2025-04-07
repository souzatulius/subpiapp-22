
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Coordenacao {
  id: string;
  descricao: string;
  sigla?: string;
}

export const useCoordenacoes = () => {
  const [coordenacoes, setCoordenacoes] = useState<Coordenacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCoordenacoes = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .order('descricao');
          
        if (error) throw error;
        
        setCoordenacoes(data || []);
      } catch (err) {
        console.error('Error fetching coordenacoes:', err);
        setError(err as Error);
        // Provide some default data as fallback
        setCoordenacoes([
          { id: 'default-1', descricao: 'CPO', sigla: 'CPO' },
          { id: 'default-2', descricao: 'Assessoria', sigla: 'ASS' },
          { id: 'default-3', descricao: 'Gabinete', sigla: 'GAB' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordenacoes();
  }, []);

  return { coordenacoes, isLoading, error };
};
