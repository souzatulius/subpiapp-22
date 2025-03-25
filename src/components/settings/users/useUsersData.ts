
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User } from './types';

export const useUsersData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Buscar usuários com informações relacionadas
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
          area_coordenacao_id,
          criado_em,
          cargos:cargo_id(id, descricao),
          areas_coordenacao:area_coordenacao_id(id, descricao)
        `)
        .order('nome_completo');
      
      if (usersError) throw usersError;
      
      // Buscar permissões para cada usuário
      const usersWithPermissions = await Promise.all(usersData.map(async (user) => {
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('usuario_permissoes')
          .select(`
            id,
            permissao_id,
            permissoes:permissao_id(id, descricao, nivel_acesso)
          `)
          .eq('usuario_id', user.id);
        
        if (permissionsError) {
          console.error('Erro ao buscar permissões:', permissionsError);
          return { ...user, permissoes: [] };
        }
        
        return { 
          ...user, 
          permissoes: permissionsData.map(p => p.permissoes)
        };
      }));
      
      setUsers(usersWithPermissions);
      setFilteredUsers(usersWithPermissions);
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

  // Filtrar usuários com base na pesquisa e filtro de status
  useEffect(() => {
    let filtered = users;
    
    // Aplicar filtro de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.nome_completo.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.cargos?.descricao.toLowerCase().includes(query) ||
        user.areas_coordenacao?.descricao?.toLowerCase().includes(query)
      );
    }
    
    // Aplicar filtro de status
    if (statusFilter !== 'todos') {
      if (statusFilter === 'ativos') {
        filtered = filtered.filter(user => true); // Todos são considerados ativos por enquanto
      } else if (statusFilter === 'inativos') {
        filtered = filtered.filter(user => false); // Nenhum é considerado inativo por enquanto
      }
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
