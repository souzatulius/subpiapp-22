
import { useState, useMemo } from 'react';
import { User } from '../types';

export const useAccessControlFilter = (users: User[]) => {
  const [filter, setFilter] = useState('');
  
  const filteredUsers = useMemo(() => {
    if (!filter.trim()) return users;
    
    const lowercasedFilter = filter.toLowerCase();
    
    return users.filter(user => 
      user.nome_completo.toLowerCase().includes(lowercasedFilter) ||
      (user.email && user.email.toLowerCase().includes(lowercasedFilter)) ||
      (user.coordenacao_id && String(user.coordenacao_id).toLowerCase().includes(lowercasedFilter)) ||
      (user.supervisao_tecnica_id && String(user.supervisao_tecnica_id).toLowerCase().includes(lowercasedFilter))
    );
  }, [users, filter]);
  
  return { filter, setFilter, filteredUsers };
};
