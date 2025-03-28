
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Permission } from './types';
import { toast } from 'sonner';

export const useAccessControlData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all coordenações and supervisões técnicas
      const { data: coordenacoes, error: coordError } = await supabase
        .from('coordenacoes')
        .select('id, descricao');
      
      if (coordError) throw coordError;
      
      const { data: supervisoes, error: supError } = await supabase
        .from('supervisoes_tecnicas')
        .select('id, descricao, coordenacao_id');
        
      if (supError) throw supError;
      
      // Fetch permissions
      const { data: pages, error: pagesError } = await supabase
        .from('paginas_sistema')
        .select('*');
      
      if (pagesError) {
        // If the table doesn't exist yet, we'll create some default permissions
        console.log('Pages table might not exist, using default permissions');
        setPermissions([
          { id: 'criar_demanda', name: 'Criar Demanda', description: 'Acesso para criar novas demandas' },
          { id: 'consultar_demandas', name: 'Consultar Demandas', description: 'Acesso para consultar demandas' },
          { id: 'responder_demandas', name: 'Responder Demandas', description: 'Acesso para responder demandas' },
          { id: 'criar_nota', name: 'Criar Nota Oficial', description: 'Acesso para criar notas oficiais' },
          { id: 'consultar_notas', name: 'Consultar Notas', description: 'Acesso para consultar notas oficiais' },
          { id: 'aprovar_notas', name: 'Aprovar Notas', description: 'Acesso para aprovar notas oficiais' },
          { id: 'relatorios', name: 'Relatórios', description: 'Acesso aos relatórios do sistema' },
          { id: 'ranking', name: 'Ranking das Subs', description: 'Acesso ao ranking das subprefeituras' },
          { id: 'settings', name: 'Ajustes', description: 'Acesso às configurações do sistema' },
        ]);
      } else {
        setPermissions(pages);
      }
      
      // Fetch all permission assignments
      const { data: permissionsData, error: permError } = await supabase
        .from('permissoes_acesso')
        .select('*');
      
      if (permError && permError.code !== 'PGRST116') {
        // PGRST116 is "relation does not exist" - we'll handle this by assuming no permissions exist yet
        throw permError;
      }
      
      // Format users data - we'll use both coordenações and supervisões técnicas as "users"
      const formattedUsers: User[] = [
        ...coordenacoes.map((coord: any) => ({
          id: coord.id,
          nome_completo: coord.descricao,
          email: '',
          coordenacao_id: coord.id,
          type: 'coordenacao'
        })),
        ...supervisoes.map((sup: any) => ({
          id: sup.id,
          nome_completo: sup.descricao,
          email: '',
          supervisao_tecnica_id: sup.id,
          coordenacao_id: sup.coordenacao_id,
          type: 'supervisao_tecnica'
        }))
      ];
      
      setUsers(formattedUsers);
      
      // Format permissions data
      const formattedPermissions: Record<string, string[]> = {};
      
      if (permissionsData) {
        permissionsData.forEach((perm: any) => {
          const entityId = perm.coordenacao_id || perm.supervisao_tecnica_id;
          if (!formattedPermissions[entityId]) {
            formattedPermissions[entityId] = [];
          }
          
          formattedPermissions[entityId].push(perm.pagina_id);
        });
      }
      
      setUserPermissions(formattedPermissions);
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
    users,
    setUsers,
    permissions,
    userPermissions,
    setUserPermissions,
    loading,
    error,
    fetchData
  };
};
