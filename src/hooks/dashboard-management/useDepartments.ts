
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/types/dashboard';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .order('descricao');
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Map the response data to match the Department interface
        const mappedDepartments: Department[] = (data || []).map(item => ({
          id: item.id,
          nome: item.descricao, // Map descricao to nome
          sigla: item.sigla,
          descricao: item.descricao
        }));
        
        setDepartments(mappedDepartments);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
};
