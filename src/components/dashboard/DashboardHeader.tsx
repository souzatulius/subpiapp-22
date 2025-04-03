
import React from 'react';

interface DashboardHeaderProps {
  firstName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ firstName }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Olá, {firstName || 'Usuário'}!</h1>
    </div>
  );
};

export default DashboardHeader;
