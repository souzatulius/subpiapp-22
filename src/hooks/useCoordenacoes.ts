
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Coordenacao {
  id: string;
  descricao: string;
  sigla?: string;
  value?: string;
  label?: string;
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
        
        const formattedCoords = data?.map(coord => ({
          ...coord,
          // Format the label to include sigla in parentheses if available
          label: coord.sigla ? `${coord.descricao} (${coord.sigla})` : coord.descricao,
          value: coord.id
        })) || [];
        
        setCoordenacoes(formattedCoords);
      } catch (err) {
        console.error('Error fetching coordenacoes:', err);
        setError(err as Error);
        // Provide some default data as fallback
        setCoordenacoes([
          { id: 'default-1', descricao: 'CPO', sigla: 'CPO', label: 'CPO', value: 'default-1' },
          { id: 'default-2', descricao: 'Assessoria', sigla: 'ASS', label: 'Assessoria (ASS)', value: 'default-2' },
          { id: 'default-3', descricao: 'Gabinete', sigla: 'GAB', label: 'Gabinete (GAB)', value: 'default-3' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordenacoes();
  }, []);

  return { coordenacoes, isLoading, error };
};
