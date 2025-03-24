
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
        // Fetch cargos
        console.log('Fetching cargos from Supabase...');
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('id, descricao')
          .order('descricao', { ascending: true });
          
        if (cargosError) throw cargosError;
        
        console.log('Cargos data received:', cargosData);
        
        // Fetch areas
        console.log('Fetching areas from Supabase...');
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao')
          .order('descricao', { ascending: true });
          
        if (areasError) throw areasError;
        
        console.log('Areas data received:', areasData);
        
        // Format data for select components
        if (cargosData) {
          const formattedRoles = cargosData.map(cargo => ({
            id: cargo.id,
            value: cargo.descricao
          }));
          setRoles(formattedRoles);
        } else {
          console.warn('No cargos found in the database');
        }
        
        if (areasData) {
          const formattedAreas = areasData.map(area => ({
            id: area.id,
            value: area.descricao
          }));
          setAreas(formattedAreas);
        } else {
          console.warn('No areas found in the database');
        }
      } catch (error) {
        console.error('Error fetching register options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);

  return { roles, areas, loadingOptions };
};
