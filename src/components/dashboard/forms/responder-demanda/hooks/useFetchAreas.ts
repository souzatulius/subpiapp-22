
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Area } from '../types';
import { toast } from '@/components/ui/use-toast';

export const useFetchAreas = () => {
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { data, error } = await supabase
          .from('areas_coordenacao')
          .select('*');
        
        if (error) {
          console.error('Error fetching areas:', error);
          toast({
            title: "Erro ao carregar áreas",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        setAreas(data || []);
      } catch (error) {
        console.error('Error in fetchAreas:', error);
        toast({
          title: "Erro ao carregar áreas",
          description: "Ocorreu um erro ao carregar as áreas.",
          variant: "destructive"
        });
      }
    };
    
    fetchAreas();
  }, []);

  return { areas };
};
