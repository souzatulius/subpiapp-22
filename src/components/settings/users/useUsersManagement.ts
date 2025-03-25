
import { useState, useEffect } from 'react';
import { useUsersData } from './useUsersData';
import { supabase } from '@/integrations/supabase/client';
import { SupervisaoTecnica, Cargo } from './types';

export const useUsersManagement = () => {
  const { users, filteredUsers, isLoading, searchQuery, setSearchQuery, statusFilter, setStatusFilter, refreshUsers } = useUsersData();
  const [supervisoesTecnicas, setSupervisoesTecnicas] = useState<SupervisaoTecnica[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch technical supervisions
      const { data: supervisoesData, error: supervisoesError } = await supabase
        .from('supervisoes_tecnicas')
        .select('id, descricao, coordenacao_id')
        .order('descricao');
      
      if (supervisoesError) throw supervisoesError;
      setSupervisoesTecnicas(supervisoesData || []);
      
      // Fetch positions
      const { data: cargosData, error: cargosError } = await supabase
        .from('cargos')
        .select('id, descricao')
        .order('descricao');
      
      if (cargosError) throw cargosError;
      setCargos(cargosData || []);
      
      // Fetch users
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
    supervisoesTecnicas,
    cargos,
    loading,
    fetchData
  };
};
