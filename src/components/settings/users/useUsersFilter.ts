
import { useState, useMemo } from 'react';
import { User } from './types';

export const useUsersFilter = (users: User[]) => {
  const [filter, setFilter] = useState('');
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchTerms = filter.toLowerCase();
      return (
        user.nome_completo?.toLowerCase().includes(searchTerms) ||
        user.email?.toLowerCase().includes(searchTerms) ||
        user.cargos?.descricao?.toLowerCase().includes(searchTerms) ||
        user.supervisao_tecnica?.descricao?.toLowerCase().includes(searchTerms)
      );
    });
  }, [users, filter]);
  
  return {
    filter,
    setFilter,
    filteredUsers,
  };
};
