
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SelectOption } from '@/components/register/RegisterForm';

export const useRegisterOptions = () => {
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Buscar cargos
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('id, descricao');
        
        if (cargosError) throw cargosError;
        
        // Buscar áreas de coordenação
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao');
        
        if (areasError) throw areasError;
        
        // Transformar dados para formato de opções
        setRoles(cargosData.map(item => ({ id: item.id, value: item.descricao })));
        setAreas(areasData.map(item => ({ id: item.id, value: item.descricao })));
        
        // Se não houver dados, adicionar alguns valores padrão
        if (cargosData.length === 0) {
          setRoles([
            { id: '1', value: 'Assessor' },
            { id: '2', value: 'Coordenador' },
            { id: '3', value: 'Analista' },
            { id: '4', value: 'Técnico' },
            { id: '5', value: 'Gestor' }
          ]);
        }
        
        if (areasData.length === 0) {
          setAreas([
            { id: '1', value: 'Gabinete' },
            { id: '2', value: 'Comunicação' },
            { id: '3', value: 'Administração' },
            { id: '4', value: 'Planejamento' },
            { id: '5', value: 'Infraestrutura' }
          ]);
        }
      } catch (error) {
        console.error('Erro ao buscar opções:', error);
        // Definir valores padrão caso falhe
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
