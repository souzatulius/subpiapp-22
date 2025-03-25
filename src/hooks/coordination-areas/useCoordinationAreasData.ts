
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
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao, sigla, coordenacao, coordenacao_id')
        .order('descricao');

      if (error) throw error;
      
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
      const { data, error } = await supabase.rpc('get_unique_coordenacoes');

      if (error) {
        console.error('Error fetching coordinations:', error);
        // Fallback if RPC fails
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao, coordenacao')
          .not('coordenacao', 'is', null)
          .order('descricao');
          
        if (fallbackError) throw fallbackError;
        
        // Convert to coordination type and remove duplicates
        const uniqueCoords = Array.from(new Set(fallbackData?.map(c => c.coordenacao) || []))
          .map(coord => {
            const coordItem = fallbackData?.find(c => c.coordenacao === coord);
            return {
              id: coordItem?.id || '',
              descricao: coord || '',
              sigla: '',
              criado_em: ''
            };
          });
          
        setCoordinations(uniqueCoords);
      } else {
        // Format coordinations from RPC
        const mappedCoordinations = data?.map(c => ({
          id: c.coordenacao_id || '',
          descricao: c.coordenacao || '',
          sigla: '',
          criado_em: ''
        })) || [];
        
        setCoordinations(mappedCoordinations);
      }
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
