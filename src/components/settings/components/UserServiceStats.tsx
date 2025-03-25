
import React from 'react';
import { Users, ArrowUpRight, Briefcase, FileText } from 'lucide-react';
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
        title="Áreas de Coordenação" 
        value={loading ? 0 : stats.areasCoordenacao} 
        icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />} 
        description="Áreas de coordenação registradas"
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
        title="Serviços" 
        value={loading ? 0 : stats.services} 
        icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
        description="Serviços registrados"
        section="servicos"
      />
    </div>
  );
};

export default UserServiceStats;
