
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User, UserStatus } from './types';

export const useUsersData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Buscar usuários com permissões e cargos associados
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Buscar dados complementares dos usuários
      const { data: appUsers, error: appError } = await supabase
        .from('usuarios')
        .select(`
          *,
          cargos:cargo_id(id, descricao)
        `);
        
      if (appError) throw appError;
      
      // Buscar as permissões de cada usuário
      const userPermissions: Record<string, { id: string, descricao: string }[]> = {};
      
      for (const user of authUsers.users) {
        const { data: permissions, error: permError } = await supabase
          .from('usuario_permissoes')
          .select(`
            permissao:permissao_id(id, descricao)
          `)
          .eq('usuario_id', user.id);
          
        if (!permError && permissions) {
          userPermissions[user.id] = permissions.map(p => p.permissao);
        }
      }
      
      // Buscar áreas de coordenação para cada usuário
      const processedUsers = await Promise.all(appUsers.map(async (appUser) => {
        let areaInfo = { id: '', descricao: 'Não definida' };
        
        if (appUser.area_coordenacao_id) {
          const { data: areaData } = await supabase
            .from('areas_coordenacao')
            .select('id, descricao')
            .eq('id', appUser.area_coordenacao_id)
            .single();
            
          if (areaData) {
            areaInfo = { 
              id: areaData.id, 
              descricao: areaData.descricao 
            };
          }
        }
        
        const authUser = authUsers.users.find(u => u.id === appUser.id);
        
        return {
          ...appUser,
          email_confirmado: authUser?.email_confirmed_at ? true : false,
          ultimo_login: authUser?.last_sign_in_at,
          permissoes: userPermissions[appUser.id] || [],
          areas_coordenacao: areaInfo
        };
      }));
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar lista de usuários',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Aplicar filtragem nos usuários
  useEffect(() => {
    let filtered = [...users];
    
    // Aplicar filtro por status se não for 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (statusFilter === 'confirmed' && user.email_confirmado) return true;
        if (statusFilter === 'pending' && !user.email_confirmado) return true;
        return false;
      });
    }
    
    // Aplicar filtro de pesquisa se houver
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.nome_completo.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.cargos?.descricao.toLowerCase().includes(query) ||
          user.areas_coordenacao?.descricao.toLowerCase().includes(query)
      );
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
    refreshUsers: fetchUsers,
  };
};
