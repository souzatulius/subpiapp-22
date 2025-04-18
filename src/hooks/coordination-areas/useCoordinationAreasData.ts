
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Area } from './types';
import { Coordination } from '@/hooks/settings/useCoordination';

export const useCoordinationAreasData = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [coordinations, setCoordinations] = useState<Coordination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAreas = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching areas with is_supervision=true');
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao, sigla, coordenacao, coordenacao_id')
        .eq('is_supervision', true) // Explicitly filter only items marked as supervisions
        .order('descricao');

      if (error) throw error;
      
      console.log('Fetched supervision areas:', data);
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar áreas de coordenação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as áreas de coordenação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCoordinations = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching coordinations with is_supervision=false');
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao, sigla, criado_em')
        .eq('is_supervision', false) // Only fetch coordinations, not supervisions
        .order('descricao');

      if (error) throw error;
      
      console.log('Fetched coordinations for dropdown:', data);
      setCoordinations(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar coordenações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as coordenações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    areas,
    coordinations,
    isLoading,
    fetchAreas,
    fetchCoordinations,
    setAreas
  };
};
