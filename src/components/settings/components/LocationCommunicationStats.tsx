
import React from 'react';
import { Map, MessageSquare, Bell } from 'lucide-react';
import StatCard from './StatCard';
import { SettingsStats } from '../types/settingsTypes';

interface LocationCommunicationStatsProps {
  stats: SettingsStats;
  loading: boolean;
  unreadNotifications: number;
}

const LocationCommunicationStats: React.FC<LocationCommunicationStatsProps> = ({ 
  stats, 
  loading,
  unreadNotifications 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Distritos" 
        value={loading ? 0 : stats.districts} 
        icon={<Map className="h-4 w-4 text-muted-foreground" />} 
        description="Distritos registrados"
        section="distritos_bairros"
      />
      <StatCard 
        title="Bairros" 
        value={loading ? 0 : stats.neighborhoods} 
        icon={<Map className="h-4 w-4 text-muted-foreground" />} 
        description="Bairros cadastrados"
        section="distritos_bairros"
      />
      <StatCard 
        title="Comunicados" 
        value={loading ? 0 : stats.announcements} 
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} 
        description="Comunicados enviados"
        section="comunicados"
      />
      <StatCard 
        title="Notificações" 
        value={loading ? 0 : stats.notifications} 
        icon={<Bell className="h-4 w-4 text-muted-foreground" />} 
        description="Notificações geradas"
        section="notifications"
        highlight={true}
        unreadCount={unreadNotifications}
      />
    </div>
  );
};

export default LocationCommunicationStats;
