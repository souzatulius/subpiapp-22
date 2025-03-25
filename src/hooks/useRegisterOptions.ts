
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SelectOption } from '@/components/register/types';
import { toast } from 'sonner';

export const useRegisterOptions = () => {
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Fetch positions from cargos table - add console logs to debug
        console.log('Fetching cargos from Supabase...');
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (cargosError) {
          console.error('Error fetching cargos:', cargosError);
          throw cargosError;
        }
        
        console.log('Cargos data received:', cargosData);
        
        // Fetch coordination areas from areas_coordenacao table
        console.log('Fetching areas from Supabase...');
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (areasError) {
          console.error('Error fetching areas:', areasError);
          throw areasError;
        }
        
        console.log('Areas data received:', areasData);
        
        // Fetch coordenações using the RPC function
        console.log('Fetching coordenações from Supabase...');
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .rpc('get_unique_coordenacoes');
        
        if (coordenacoesError) {
          console.error('Error fetching coordenações:', coordenacoesError);
          throw coordenacoesError;
        }
        
        console.log('Coordenações data received:', coordenacoesData);
        
        if (!cargosData || cargosData.length === 0) {
          console.warn('No cargos found in the database');
        }
        
        if (!areasData || areasData.length === 0) {
          console.warn('No areas found in the database');
        }
        
        if (!coordenacoesData || coordenacoesData.length === 0) {
          console.warn('No coordenações found in the database');
        }
        
        // Transform data to options format
        setRoles(cargosData?.map(item => ({ id: item.id, value: item.descricao })) || []);
        setAreas(areasData?.map(item => ({ id: item.id, value: item.descricao })) || []);
        setCoordenacoes(coordenacoesData?.map(item => ({ 
          id: item.coordenacao_id, 
          value: item.coordenacao 
        })) || []);
      } catch (error) {
        console.error('Error fetching options:', error);
        toast.error('Erro ao carregar opções de cargos e áreas');
        // Define empty values in case of error
        setRoles([]);
        setAreas([]);
        setCoordenacoes([]);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);

  return { roles, areas, coordenacoes, loadingOptions };
};
