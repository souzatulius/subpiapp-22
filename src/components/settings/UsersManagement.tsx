
import React from 'react';
import { useUsersManagement } from './users/useUsersManagement';
import UsersLayout from './users/UsersLayout';

const UsersManagement = () => {
  const usersManagementProps = useUsersManagement();
  
  return <UsersLayout {...usersManagementProps} />;
};

export default UsersManagement;
