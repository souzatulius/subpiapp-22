
import React from 'react';

interface DashboardHeaderProps {
  firstName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ firstName }) => {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-3xl font-bold text-slate-950">Olá, {firstName || 'Usuário'}!</h3>
      <h1 className="text-2xl font-bold text-gray-800"></h1>
    </div>
  );
};

export default DashboardHeader;
