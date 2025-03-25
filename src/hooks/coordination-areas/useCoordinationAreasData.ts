
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CoordinationArea } from './types';
import { Coordination } from '@/hooks/settings/useCoordination';

export const useCoordinationAreasData = () => {
  const [areas, setAreas] = useState<CoordinationArea[]>([]);
  const [coordinations, setCoordinations] = useState<Coordination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAreas = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao');

      if (error) throw error;
      
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar supervisões técnicas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as supervisões técnicas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCoordinations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao');

      if (error) throw error;
      
      setCoordinations(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar coordenações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as coordenações.",
        variant: "destructive",
      });
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
