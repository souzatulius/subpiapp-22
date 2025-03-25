
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
        // Fetch positions from cargos table
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
        
        // Fetch supervisions from supervisoes_tecnicas table
        console.log('Fetching supervisions from Supabase...');
        const { data: supervisoesData, error: supervisoesError } = await supabase
          .from('supervisoes_tecnicas')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (supervisoesError) {
          console.error('Error fetching supervisions:', supervisoesError);
          throw supervisoesError;
        }
        
        console.log('Supervisions data received:', supervisoesData);
        
        // Fetch coordenações from the new table
        console.log('Fetching coordenações from Supabase...');
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao', { ascending: true });
        
        if (coordenacoesError) {
          console.error('Error fetching coordenações:', coordenacoesError);
          throw coordenacoesError;
        }
        
        console.log('Coordenações data received:', coordenacoesData);
        
        if (!cargosData || cargosData.length === 0) {
          console.warn('No cargos found in the database');
        }
        
        if (!supervisoesData || supervisoesData.length === 0) {
          console.warn('No supervisions found in the database');
        }
        
        if (!coordenacoesData || coordenacoesData.length === 0) {
          console.warn('No coordenações found in the database');
        }
        
        // Transform data to options format
        setRoles(cargosData?.map(item => ({ id: item.id, value: item.descricao })) || []);
        setAreas(supervisoesData?.map(item => ({ id: item.id, value: item.descricao })) || []);
        setCoordenacoes(coordenacoesData?.map(item => ({ 
          id: item.id, 
          value: item.descricao 
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
