
import React from 'react';
import { useUsersManagement } from './users/useUsersManagement';
import UsersLayout from './users/UsersLayout';

const UsersManagement = () => {
  const usersManagementProps = useUsersManagement();
  
  return (
    <div>
      <UsersLayout {...usersManagementProps} />
    </div>
  );
};

export default UsersManagement;
