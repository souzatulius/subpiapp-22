import React from 'react';
import { useSettingsStats } from './hooks/useSettingsStats';
import UserServiceStats from './components/UserServiceStats';
import LocationCommunicationStats from './components/LocationCommunicationStats';
const SettingsDashboard = () => {
  const {
    stats,
    loading,
    unreadNotifications
  } = useSettingsStats();
  return <div className="space-y-6">
      
      
      <UserServiceStats stats={stats} loading={loading} />
      
      <LocationCommunicationStats stats={stats} loading={loading} unreadNotifications={unreadNotifications} />
    </div>;
};
export default SettingsDashboard;