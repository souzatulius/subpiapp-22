
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
        
        // Fetch coordenações using the RPC function
        console.log('Fetching coordenações from Supabase...');
        const { data: coordenacoesData, error: coordenacoesError } = await supabase.rpc('get_unique_coordenacoes');
        
        if (coordenacoesError) {
          console.error('Error fetching coordenações:', coordenacoesError);
          // Fallback if the RPC function isn't available - simpler version without labels
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('areas_coordenacao')
            .select('id, coordenacao')
            .not('coordenacao', 'is', null)
            .order('coordenacao', { ascending: true });
            
          if (fallbackError) throw fallbackError;
          
          // Remove duplicates by coordenacao
          const uniqueCoordenacoes = fallbackData ? 
            Array.from(new Set(fallbackData.map(c => c.coordenacao)))
              .map(coordName => {
                const coord = fallbackData.find(c => c.coordenacao === coordName);
                return {
                  id: coord?.id || '',
                  value: coord?.coordenacao || ''
                };
              })
              .filter(c => c.id && c.value) : [];
              
          setCoordenacoes(uniqueCoordenacoes);
        } else {
          console.log('Coordenações data received:', coordenacoesData);
          const formattedCoordenacoes = coordenacoesData ? 
            coordenacoesData.map(coord => ({
              id: coord.coordenacao_id || '',
              value: coord.coordenacao || ''
            }))
            .filter(c => c.id && c.value) : [];
          setCoordenacoes(formattedCoordenacoes);
        }
        
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

  return { roles, areas, coordenacoes, loadingOptions };
};
