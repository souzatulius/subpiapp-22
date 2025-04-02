
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Permission } from './types';
import { toast } from 'sonner';

export interface Coordenacao {
  id: string;
  descricao: string;
  sigla?: string;
}

export const useAccessControlData = () => {
  const [coordenacoes, setCoordenacoes] = useState<Coordenacao[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [coordinationPermissions, setCoordinationPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all coordenações
      const { data: coordenacoesData, error: coordError } = await supabase
        .from('coordenacoes')
        .select('id, descricao, sigla')
        .order('descricao');
      
      if (coordError) throw coordError;
      
      // Fetch permissions from paginas_sistema table
      const { data: pagesData, error: pagesError } = await supabase
        .from('paginas_sistema')
        .select('*');
      
      if (pagesError) {
        console.error('Error fetching pages:', pagesError);
        // Default permissions if there's an error
        setPermissions([
          { id: 'criar_demanda', name: 'Criar Demanda', description: 'Acesso para criar novas demandas', nivel_acesso: 50 },
          { id: 'consultar_demandas', name: 'Consultar Demandas', description: 'Acesso para consultar demandas', nivel_acesso: 10 },
          { id: 'responder_demandas', name: 'Responder Demandas', description: 'Acesso para responder demandas', nivel_acesso: 50 },
          { id: 'criar_nota', name: 'Criar Nota Oficial', description: 'Acesso para criar notas oficiais', nivel_acesso: 50 },
          { id: 'consultar_notas', name: 'Consultar Notas', description: 'Acesso para consultar notas oficiais', nivel_acesso: 10 },
          { id: 'aprovar_notas', name: 'Aprovar Notas', description: 'Acesso para aprovar notas oficiais', nivel_acesso: 80 },
          { id: 'relatorios', name: 'Relatórios', description: 'Acesso aos relatórios do sistema', nivel_acesso: 70 },
          { id: 'ranking', name: 'Ranking das Subs', description: 'Acesso ao ranking das subprefeituras', nivel_acesso: 70 },
          { id: 'settings', name: 'Ajustes', description: 'Acesso às configurações do sistema', nivel_acesso: 90 },
        ]);
      } else {
        // Convert database columns to match our Permission interface
        const formattedPermissions: Permission[] = pagesData.map(page => ({
          id: page.id,
          name: page.name,
          description: page.description,
          nivel_acesso: page.nivel_acesso
        }));
        
        setPermissions(formattedPermissions);
      }
      
      // Fetch all permission assignments - only for coordenações now
      const { data: permissionsData, error: permError } = await supabase
        .from('permissoes_acesso')
        .select('*')
        .not('coordenacao_id', 'is', null); // Only get permissions assigned to coordenações
      
      if (permError && permError.code !== 'PGRST116') {
        throw permError;
      }
      
      setCoordenacoes(coordenacoesData || []);
      setTotalUsers(coordenacoesData?.length || 0);
      
      // Format permissions data for coordenações
      const formattedPermissions: Record<string, string[]> = {};
      
      if (permissionsData) {
        permissionsData.forEach((perm: any) => {
          if (perm.coordenacao_id) {
            if (!formattedPermissions[perm.coordenacao_id]) {
              formattedPermissions[perm.coordenacao_id] = [];
            }
            
            formattedPermissions[perm.coordenacao_id].push(perm.pagina_id);
          }
        });
      }
      
      setCoordinationPermissions(formattedPermissions);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    coordenacoes,
    setCoordenacoes,
    permissions,
    coordinationPermissions,
    setCoordinationPermissions,
    loading,
    error,
    fetchData,
    totalUsers
  };
};
