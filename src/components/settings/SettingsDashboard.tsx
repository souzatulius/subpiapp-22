
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
  
  // Agora usamos coordenacoes em vez de totalUsers
  const totalCoordenacoes = coordenacoes?.length || 0;
  
  return (
    <div className="space-y-6">
      <WelcomeCard 
        userCount={totalCoordenacoes}
        label="coordenações"
        color="bg-gradient-to-r from-blue-800 to-blue-950"
      />
      
      <div className="space-y-8">
        <UserServiceStats stats={stats} loading={loading} />
      </div>
    </div>
  );
};

export default SettingsDashboard;
