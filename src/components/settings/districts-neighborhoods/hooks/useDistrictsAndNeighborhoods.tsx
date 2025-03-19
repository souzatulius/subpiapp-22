
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useDistrictsAndNeighborhoods = () => {
  const [activeTab, setActiveTab] = useState('districts');
  const [districts, setDistricts] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDistricts();
    fetchNeighborhoods();
  }, []);

  const fetchDistricts = async () => {
    setLoadingDistricts(true);
    try {
      const { data, error } = await supabase
        .from('distritos')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) throw error;
      setDistricts(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar distritos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os distritos',
        variant: 'destructive',
      });
    } finally {
      setLoadingDistricts(false);
    }
  };
  
  const fetchNeighborhoods = async () => {
    setLoadingNeighborhoods(true);
    try {
      const { data, error } = await supabase
        .from('bairros')
        .select(`
          *,
          distritos(id, nome)
        `)
        .order('nome', { ascending: true });
      
      if (error) throw error;
      setNeighborhoods(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar bairros:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os bairros',
        variant: 'destructive',
      });
    } finally {
      setLoadingNeighborhoods(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    districts,
    neighborhoods,
    loadingDistricts,
    loadingNeighborhoods,
    isSubmitting,
    setIsSubmitting,
    fetchDistricts,
    fetchNeighborhoods,
  };
};
