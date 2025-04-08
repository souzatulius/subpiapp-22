
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SelectOption } from '@/components/register/types';

export const useRegisterOptions = () => {
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Fetch roles (cargos)
        const { data: rolesData, error: rolesError } = await supabase
          .from('cargos')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (rolesError) throw rolesError;
        setRoles(rolesData.map(item => ({ value: item.id, label: item.descricao })));
        
        // Fetch coordination areas
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao')
          .eq('is_supervision', true)
          .order('descricao', { ascending: true });
        
        if (areasError) throw areasError;
        setAreas(areasData.map(item => ({ value: item.id, label: item.descricao })));
        
        // Fetch coordenacoes
        const { data: coordData, error: coordError } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (coordError) throw coordError;
        setCoordenacoes(coordData.map(item => ({ value: item.id, label: item.descricao })));
        
      } catch (error) {
        console.error('Error fetching registration options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  return { roles, areas, coordenacoes, loadingOptions };
};
