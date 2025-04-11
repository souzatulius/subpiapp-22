
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User, UserStatus } from './types';

export const useUsersData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching users data...');
      
      // Fetch users with basic columns from the correct 'usuarios' table
      const { data: usersData, error: usersError } = await supabase
        .from('usuarios')
        .select(`
          id,
          nome_completo,
          email,
          whatsapp,
          aniversario,
          foto_perfil_url,
          cargo_id,
          supervisao_tecnica_id,
          coordenacao_id,
          criado_em,
          status,
          status_conta
        `)
        .not('status', 'eq', 'excluido')
        .order('nome_completo');
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }
      
      console.log(`Fetched ${usersData?.length || 0} users`);
      
      // Process to add related data
      const processedUsers = await Promise.all((usersData || []).map(async (user: any) => {
        // Fetch position
        let cargoInfo = { id: '', descricao: '' };
        if (user.cargo_id) {
          const { data: cargoData, error: cargoError } = await supabase
            .from('cargos')
            .select('id, descricao')
            .eq('id', user.cargo_id)
            .single();
            
          if (!cargoError && cargoData) {
            cargoInfo = cargoData;
          }
        }
        
        // Fetch technical supervision
        let supervisaoTecnica = { id: '', descricao: '', coordenacao_id: '' };
        if (user.supervisao_tecnica_id) {
          const { data: supervisaoData, error: supervisaoError } = await supabase
            .from('supervisoes_tecnicas')
            .select('id, descricao, coordenacao_id')
            .eq('id', user.supervisao_tecnica_id)
            .maybeSingle();
            
          if (!supervisaoError && supervisaoData) {
            supervisaoTecnica = {
              id: supervisaoData.id || '',
              descricao: supervisaoData.descricao || '',
              coordenacao_id: supervisaoData.coordenacao_id || ''
            };
          }
        }
        
        // Fetch coordination
        let coordenacao = { id: '', descricao: '' };
        if (user.coordenacao_id) {
          const { data: coordenacaoData, error: coordenacaoError } = await supabase
            .from('coordenacoes')
            .select('id, descricao')
            .eq('id', user.coordenacao_id)
            .maybeSingle();
            
          if (!coordenacaoError && coordenacaoData) {
            coordenacao = {
              id: coordenacaoData.id || '',
              descricao: coordenacaoData.descricao || ''
            };
          }
        }
        
        // Fetch permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('usuario_permissoes')
          .select(`
            id,
            permissao_id,
            permissoes:permissao_id(id, descricao, nivel_acesso)
          `)
          .eq('usuario_id', user.id);
        
        let permissoes = [];
        if (!permissionsError && permissionsData) {
          permissoes = permissionsData.map((p: any) => p.permissoes).filter(Boolean);
          console.log(`User ${user.id} has ${permissoes.length} permissions`);
        }

        // If user has permissions but status is not set to 'ativo', we'll fix it in the backend
        // but still show the correct status in the frontend
        const hasPermissions = permissoes.length > 0;
        const displayStatus = hasPermissions ? 'ativo' : user.status || 'pendente';
        
        return { 
          ...user, 
          status: displayStatus,
          cargos: cargoInfo,
          supervisao_tecnica: supervisaoTecnica,
          coordenacao: coordenacao,
          permissoes
        } as User;
      }));
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search and status
  useEffect(() => {
    let filtered = users;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.nome_completo.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.cargos?.descricao.toLowerCase().includes(query) ||
        user.supervisao_tecnica?.descricao?.toLowerCase().includes(query) ||
        user.coordenacao?.descricao?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(user => {
        if (statusFilter === 'aguardando_email') {
          return user.status === 'aguardando_email';
        } else if (statusFilter === 'pendente') {
          return user.status === 'pendente';
        } else if (statusFilter === 'ativo') {
          return user.status === 'ativo';
        }
        return true;
      });
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, statusFilter]);

  return {
    users,
    filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshUsers: fetchUsers
  };
};
