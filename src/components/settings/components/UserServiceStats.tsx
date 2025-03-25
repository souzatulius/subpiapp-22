
import React from 'react';
import { Users, ArrowUpRight, Briefcase, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';
import { SettingsStats } from '../types/settingsTypes';

interface UserServiceStatsProps {
  stats: SettingsStats;
  loading: boolean;
}

const UserServiceStats: React.FC<UserServiceStatsProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Usuários" 
        value={loading ? 0 : stats.usuarios} 
        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        description="Total de usuários cadastrados"
        section="usuarios"
      />
      <StatCard 
        title="Supervisões Técnicas" 
        value={loading ? 0 : stats.supervisoesTecnicas} 
        icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />} 
        description="Supervisões técnicas registradas"
        section="areas"
      />
      <StatCard 
        title="Cargos" 
        value={loading ? 0 : stats.cargos} 
        icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} 
        description="Tipos de cargos disponíveis"
        section="cargos"
      />
      <StatCard 
        title="Problemas" 
        value={loading ? 0 : stats.problemas} 
        icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />} 
        description="Problemas registrados"
        section="problemas"
      />
    </div>
  );
};

export default UserServiceStats;
