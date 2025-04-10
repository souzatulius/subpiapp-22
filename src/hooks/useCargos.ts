
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Cargo {
  id: string;
  descricao: string;
}

export const useCargos = () => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('cargos')
          .select('id, descricao')
          .order('descricao');
          
        if (error) throw error;
        
        setCargos(data || []);
      } catch (err) {
        console.error('Error fetching cargos:', err);
        setError(err as Error);
        toast({
          title: "Erro ao carregar cargos",
          description: "Não foi possível carregar a lista de cargos. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCargos();
  }, []);

  return { cargos, isLoading, error };
};
