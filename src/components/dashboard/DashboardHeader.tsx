
import React from 'react';

interface DashboardHeaderProps {
  firstName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ firstName }) => {
  return (
    <div className="mb-6">
      {/* Removed the greeting heading since it's now in the WelcomeCard */}
      <h1 className="text-2xl font-bold text-gray-800"></h1>
    </div>
  );
};

export default DashboardHeader;
