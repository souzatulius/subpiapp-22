
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeCard from './components/WelcomeCard';
import UserServiceStats from './components/UserServiceStats';
import { useSettingsStats } from '@/hooks/settings/useSettingsStats';
import { useAccessControlData } from './access-control/useAccessControlData';

interface SettingsDashboardProps {
  searchQuery: string;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { stats, loading } = useSettingsStats();
  const { totalUsers } = useAccessControlData();

  return (
    <div className="space-y-6">
      <WelcomeCard userCount={totalUsers} />
      
      <div className="space-y-8">
        <UserServiceStats stats={stats} loading={loading} />
      </div>
    </div>
  );
};

export default SettingsDashboard;
