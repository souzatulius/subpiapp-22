
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
      
      // Buscar usuários - selecionando apenas colunas básicas
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
          criado_em
        `)
        .order('nome_completo');
      
      if (usersError) throw usersError;
      
      // Processar para adicionar dados relacionados
      const processedUsers = await Promise.all((usersData || []).map(async (user) => {
        // Buscar cargo
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
        
        // Buscar área
        let areaInfo = { id: '', descricao: '' };
        if (user.area_coordenacao_id) {
          const { data: areaData, error: areaError } = await supabase
            .from('areas_coordenacao')
            .select('id, descricao')
            .eq('id', user.area_coordenacao_id)
            .single();
            
          if (!areaError && areaData) {
            areaInfo = areaData;
          }
        }
        
        // Buscar permissões
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('usuario_permissoes')
          .select(`
            id,
            permissao_id,
            permissoes:permissao_id(id, descricao, nivel_acesso)
          `)
          .eq('usuario_id', user.id);
        
        let permissoes = [];
        if (!permissionsError) {
          permissoes = permissionsData.map((p: any) => p.permissoes);
        }
        
        return { 
          ...user, 
          cargos: cargoInfo,
          areas_coordenacao: areaInfo,
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
        filtered = filtered.filter(user => user.permissoes && user.permissoes.length > 0);
      } else if (statusFilter === 'inativos') {
        filtered = filtered.filter(user => !user.permissoes || user.permissoes.length === 0);
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
