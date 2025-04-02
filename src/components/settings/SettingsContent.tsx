
import React from 'react';
import DashboardManagementContent from './dashboard-management/DashboardManagementContent';

interface SettingsContentProps {
  activeSection: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ activeSection }) => {
  // Render the appropriate content based on the active section
  switch (activeSection) {
    case 'dashboard_management':
      return <DashboardManagementContent />;
    default:
      return (
        <div className="p-6 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
          Selecione uma opção no menu de configurações.
        </div>
      );
  }
};

export default SettingsContent;
