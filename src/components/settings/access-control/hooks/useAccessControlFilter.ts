
import { useState } from 'react';
import { User } from '../types';
import { filterUsers } from '../accessControlUtils';

export const useAccessControlFilter = (users: User[]) => {
  const [filter, setFilter] = useState('');
  
  // Filter users based on search term
  const filteredUsers = filterUsers(users, filter);

  return {
    filter,
    setFilter,
    filteredUsers
  };
};
