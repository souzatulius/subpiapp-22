
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Service, Area } from './types';

export function useServicesData() {
  const [services, setServices] = useState<Service[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      console.log('Buscando áreas (supervisões técnicas)...');
      const { data, error } = await supabase
        .from('supervisoes_tecnicas')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      
      console.log('Áreas carregadas:', data);
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar áreas:', error);
      setAreas([]);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      console.log('Buscando serviços...');
      const { data, error } = await supabase
        .from('servicos')
        .select(`
          *,
          supervisao_tecnica:supervisao_id(id, descricao)
        `)
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our Service type
      const transformedData: Service[] = (data || []).map((item: any) => ({
        ...item,
        supervisao_tecnica: item.supervisao_tecnica,
        supervisao_tecnica_id: item.supervisao_id
      }));
      
      console.log('Serviços carregados:', transformedData);
      setServices(transformedData);
    } catch (error: any) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços',
        variant: 'destructive',
      });
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    setServices,
    areas,
    loading,
    fetchServices
  };
}
