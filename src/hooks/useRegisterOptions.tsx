
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SelectOption } from '@/components/register/types';
import { useCoordenacoes } from '@/hooks/useCoordenacoes';

export const useRegisterOptions = () => {
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const { coordenacoes, isLoading: loadingCoordenacoes, error: coordenacoesError } = useCoordenacoes();
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(true);

  // Fetch roles (cargos)
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const { data, error } = await supabase
          .from('cargos')
          .select('id, descricao')
          .order('descricao');

        if (error) {
          throw error;
        }

        const formattedRoles = data?.map(role => ({
          id: role.id,
          value: role.descricao,
          label: role.descricao
        })) || [];

        setRoles(formattedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Fetch areas (supervisões técnicas)
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoadingAreas(true);
        const { data, error } = await supabase
          .from('supervisoes_tecnicas')
          .select('id, descricao, sigla, coordenacao_id')
          .order('descricao');

        if (error) {
          throw error;
        }

        const formattedAreas = data?.map(area => ({
          id: area.id,
          value: area.descricao,
          label: area.descricao,
          sigla: area.sigla,
          coordenacao_id: area.coordenacao_id
        })) || [];

        setAreas(formattedAreas);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);

  const loadingOptions = loadingRoles || loadingAreas || loadingCoordenacoes;

  return {
    roles,
    areas,
    coordenacoes,
    loadingOptions,
    errors: {
      coordenacoesError
    }
  };
};
