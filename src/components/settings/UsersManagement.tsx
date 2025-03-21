
import React from 'react';
import { useUsersManagement } from './users/useUsersManagement';
import UsersLayout from './users/UsersLayout';
import BackButton from '@/components/layouts/BackButton';

const UsersManagement = () => {
  const usersManagementProps = useUsersManagement();
  
  return (
    <div className="relative">
      <BackButton destination="/settings" title="Voltar para Configurações" />
      <div className="pt-14">
        <UsersLayout {...usersManagementProps} />
      </div>
    </div>
  );
};

export default UsersManagement;
