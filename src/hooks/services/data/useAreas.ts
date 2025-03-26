
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Area } from '../types';

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAreas = async () => {
    try {
      console.log('Buscando áreas (supervisões técnicas)...');
      const { data, error } = await supabase
        .from('supervisoes_tecnicas')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      
      // Filter out areas with empty IDs
      const validAreas = (data || []).filter(area => area.id && area.id.trim() !== '');
      console.log('Áreas carregadas:', validAreas);
      setAreas(validAreas);
    } catch (error: any) {
      console.error('Erro ao carregar áreas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as áreas',
        variant: 'destructive',
      });
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return {
    areas,
    loading,
    fetchAreas
  };
}
