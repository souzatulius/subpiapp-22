
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SelectOption } from '@/components/register/types';

export function useRegisterOptions() {
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        
        // Fetch cargos (roles) from the cargos table
        const { data: rolesData, error: rolesError } = await supabase
          .from('cargos')
          .select('id, descricao')
          .order('descricao');
        
        if (rolesError) throw rolesError;
        
        // Fetch coordenacoes
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao');
        
        if (coordenacoesError) throw coordenacoesError;

        // Fetch areas from supervisoes_tecnicas
        const { data: areasData, error: areasError } = await supabase
          .from('supervisoes_tecnicas')
          .select('id, descricao, coordenacao_id')
          .order('descricao');
        
        if (areasError) throw areasError;
        
        // Format data as SelectOption
        const formattedRoles = rolesData.map(role => ({
          id: role.id,
          value: role.descricao
        }));
        
        const formattedCoordenacoes = coordenacoesData.map(coord => ({
          id: coord.id,
          value: coord.descricao
        }));

        const formattedAreas = areasData.map(area => ({
          id: area.id,
          value: area.descricao,
          coordenacao_id: area.coordenacao_id
        }));
        
        console.log('Fetched roles:', formattedRoles);
        console.log('Fetched coordenacoes:', formattedCoordenacoes);
        console.log('Fetched areas:', formattedAreas);
        
        setRoles(formattedRoles);
        setCoordenacoes(formattedCoordenacoes);
        setAreas(formattedAreas);
      } catch (error) {
        console.error('Error fetching options:', error);
        toast({
          title: "Erro ao carregar opções",
          description: "Não foi possível carregar as opções para o cadastro.",
          variant: "destructive"
        });
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);
  
  return { roles, areas, coordenacoes, loadingOptions };
}
