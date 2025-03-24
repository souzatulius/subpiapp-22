
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
          .select('id, descricao');
        
        if (cargosError) throw cargosError;
        
        // Fetch coordination areas from areas_coordenacao table
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao');
        
        if (areasError) throw areasError;
        
        // Transform data to options format
        setRoles(cargosData.map(item => ({ id: item.id, value: item.descricao })));
        setAreas(areasData.map(item => ({ id: item.id, value: item.descricao })));
      } catch (error) {
        console.error('Error fetching options:', error);
        // Set fallback default values if fetch fails
        setRoles([
          { id: '1', value: 'Assessor' },
          { id: '2', value: 'Coordenador' },
          { id: '3', value: 'Analista' },
          { id: '4', value: 'Técnico' },
          { id: '5', value: 'Gestor' }
        ]);
        
        setAreas([
          { id: '1', value: 'Gabinete' },
          { id: '2', value: 'Comunicação' },
          { id: '3', value: 'Administração' },
          { id: '4', value: 'Planejamento' },
          { id: '5', value: 'Infraestrutura' }
        ]);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);

  return { roles, areas, loadingOptions };
};
