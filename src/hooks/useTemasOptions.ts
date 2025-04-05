
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Tema {
  id: string;
  descricao: string;
}

export const useTemasOptions = () => {
  const { data: temas = [], isLoading } = useQuery({
    queryKey: ['temas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temas')
        .select('id, descricao')
        .order('descricao');
      
      if (error) throw error;
      return data as Tema[];
    },
  });

  return {
    temas,
    isLoading
  };
};
