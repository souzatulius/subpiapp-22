
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SelectOption } from '@/components/register/types';

export const useRegisterOptions = () => {
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Fetch positions from cargos table
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (cargosError) throw cargosError;
        
        // Fetch coordination areas from areas_coordenacao table
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (areasError) throw areasError;
        
        // Transform data to options format
        setRoles(cargosData.map(item => ({ id: item.id, value: item.descricao })));
        setAreas(areasData.map(item => ({ id: item.id, value: item.descricao })));
      } catch (error) {
        console.error('Error fetching options:', error);
        // Definir valores vazios em caso de erro, em vez de valores padrão fixos
        setRoles([]);
        setAreas([]);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);

  return { roles, areas, loadingOptions };
};
