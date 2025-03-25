
import { useState, useEffect } from 'react';
import { useUsersData } from './useUsersData';
import { supabase } from '@/integrations/supabase/client';
import { Area, Cargo } from './types';

export const useUsersManagement = () => {
  const { users, filteredUsers, isLoading, searchQuery, setSearchQuery, statusFilter, setStatusFilter, refreshUsers } = useUsersData();
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar áreas
      const { data: areasData, error: areasError } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao')
        .order('descricao');
      
      if (areasError) throw areasError;
      setAreas(areasData || []);
      
      // Buscar cargos
      const { data: cargosData, error: cargosError } = await supabase
        .from('cargos')
        .select('id, descricao')
        .order('descricao');
      
      if (cargosError) throw cargosError;
      setCargos(cargosData || []);
      
      // Buscar usuários
      await refreshUsers();
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    users,
    filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshUsers,
    areas,
    cargos,
    loading,
    fetchData
  };
};
