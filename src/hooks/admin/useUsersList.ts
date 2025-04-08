
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserWithPermissions {
  id: string;
  nome_completo: string;
  email: string;
  cargo: string;
  coordenacao: string;
  supervisao_tecnica?: string;
  permissoes: string[];
  nivel_acesso: number;
}

export function useUsersList() {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch users with their basic info from the correct 'usuarios' table
        const { data: usersData, error: usersError } = await supabase
          .from('usuarios')
          .select(`
            id,
            nome_completo,
            email,
            cargo_id,
            coordenacao_id,
            supervisao_tecnica_id
          `);
          
        if (usersError) throw usersError;
        
        // Fetch permissions for all users
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('usuario_permissoes')
          .select(`
            usuario_id,
            permissao_id,
            permissoes:permissao_id (
              id,
              descricao,
              nivel_acesso
            )
          `);
          
        if (permissionsError) throw permissionsError;
        
        // Fetch cargo details
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('id, descricao');
          
        if (cargosError) throw cargosError;
        
        // Fetch coordenações details
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('coordenacoes')
          .select('id, descricao');
          
        if (coordenacoesError) throw coordenacoesError;
        
        // Fetch supervisões técnicas details
        const { data: supervisoesData, error: supervisoesError } = await supabase
          .from('supervisoes_tecnicas')
          .select('id, descricao');
          
        if (supervisoesError) throw supervisoesError;
        
        // Map users with their permissions and metadata
        const usersWithPermissions = usersData.map(user => {
          // Get user permissions
          const userPermissions = permissionsData.filter(p => p.usuario_id === user.id);
          
          // Get cargo description
          const cargo = cargosData.find(c => c.id === user.cargo_id);
          
          // Get coordenação description
          const coordenacao = coordenacoesData.find(c => c.id === user.coordenacao_id);
          
          // Get supervisão técnica description
          const supervisao = supervisoesData.find(s => s.id === user.supervisao_tecnica_id);
          
          // Calculate highest permission level
          const highestPermission = userPermissions.reduce(
            (highest, current) => {
              const nivel = current.permissoes?.nivel_acesso || 0;
              return nivel > highest ? nivel : highest;
            }, 
            0
          );
          
          return {
            id: user.id,
            nome_completo: user.nome_completo,
            email: user.email,
            cargo: cargo?.descricao || 'Não definido',
            coordenacao: coordenacao?.descricao || 'Não definido',
            supervisao_tecnica: supervisao?.descricao,
            permissoes: userPermissions.map(p => p.permissoes?.descricao || '').filter(Boolean),
            nivel_acesso: highestPermission
          };
        });
        
        setUsers(usersWithPermissions);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        setError(error.message || 'Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []);

  return { users, loading, error };
}
