
import React from 'react';
import WelcomeCard from './components/WelcomeCard';
import UserServiceStats from './components/UserServiceStats';
import { useSettingsStats } from '@/hooks/settings/useSettingsStats';
import { useAccessControlData } from './access-control/useAccessControlData';

interface SettingsDashboardProps {
  searchQuery: string;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ searchQuery }) => {
  const { stats, loading } = useSettingsStats();
  const { coordenacoes } = useAccessControlData();
  
  return (
    <div className="space-y-6 pb-4">
      <WelcomeCard 
        color="bg-gradient-to-r from-blue-800 to-blue-950"
      />
      
      <div className="space-y-6">
        <UserServiceStats stats={stats} loading={loading} />
      </div>
    </div>
  );
};

export default SettingsDashboard;
