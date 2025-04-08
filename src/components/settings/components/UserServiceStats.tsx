
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowUpRight, Briefcase, AlertTriangle, Settings, Shield, FileText, MapPin, Bell, Globe, Image, MessageSquare } from 'lucide-react';
import StatCard from './StatCard';
import { SettingsStats } from '../types/settingsTypes';

interface UserServiceStatsProps {
  stats: SettingsStats;
  loading: boolean;
}

const UserServiceStats: React.FC<UserServiceStatsProps> = ({ stats, loading }) => {
  const navigate = useNavigate();

  const handleCardClick = (section: string) => {
    navigate(`/settings?tab=${section}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Usuários" 
        value={loading ? 0 : stats.usuarios} 
        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        description="Total de usuários cadastrados"
        section="usuarios"
        onClick={() => handleCardClick('usuarios')}
      />
      <StatCard 
        title="Cargos" 
        value={loading ? 0 : stats.cargos} 
        icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} 
        description="Tipos de cargos disponíveis"
        section="cargos"
        onClick={() => handleCardClick('cargos')}
      />
      <StatCard 
        title="Permissões" 
        value={loading ? 0 : stats.permissoes} 
        icon={<Shield className="h-4 w-4 text-muted-foreground" />} 
        description="Níveis de acesso"
        section="permissoes"
        onClick={() => handleCardClick('permissoes')}
      />
      <StatCard 
        title="Coordenações" 
        value={loading ? 0 : stats.coordenacoes} 
        icon={<Settings className="h-4 w-4 text-muted-foreground" />} 
        description="Total de coordenações"
        section="coordenacoes_lista"
        onClick={() => handleCardClick('coordenacoes_lista')}
      />
      <StatCard 
        title="Supervisões Técnicas" 
        value={loading ? 0 : stats.supervisoesTecnicas} 
        icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />} 
        description="Supervisões técnicas registradas"
        section="areas"
        onClick={() => handleCardClick('areas')}
      />
      <StatCard 
        title="Serviços" 
        value={loading ? 0 : stats.servicos} 
        icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
        description="Serviços cadastrados"
        section="servicos"
        onClick={() => handleCardClick('servicos')}
      />
      <StatCard 
        title="Problemas/Temas" 
        value={loading ? 0 : stats.problemas} 
        icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />} 
        description="Problemas registrados"
        section="problemas"
        onClick={() => handleCardClick('problemas')}
      />
      <StatCard 
        title="Distritos/Bairros" 
        value={loading ? 0 : (stats.distritos + stats.bairros)} 
        icon={<MapPin className="h-4 w-4 text-muted-foreground" />} 
        description="Total de distritos e bairros"
        section="distritos_bairros"
        onClick={() => handleCardClick('distritos_bairros')}
      />
      <StatCard 
        title="Comunicados" 
        value={loading ? 0 : stats.comunicados} 
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} 
        description="Comunicados enviados"
        section="comunicados"
        onClick={() => handleCardClick('comunicados')}
      />
      <StatCard 
        title="Notificações" 
        value={loading ? 0 : stats.notificacoes} 
        icon={<Bell className="h-4 w-4 text-muted-foreground" />} 
        description="Total de notificações"
        section="notificacoes"
        onClick={() => handleCardClick('notificacoes')}
      />
      <StatCard 
        title="Origem das Demandas" 
        value={loading ? 0 : stats.origensDemanda} 
        icon={<Globe className="h-4 w-4 text-muted-foreground" />} 
        description="Fontes de demandas"
        section="origens_demanda"
        onClick={() => handleCardClick('origens_demanda')}
      />
      <StatCard 
        title="Tipos de Mídia" 
        value={loading ? 0 : stats.tiposMidia} 
        icon={<Image className="h-4 w-4 text-muted-foreground" />} 
        description="Tipos de mídia"
        section="tipos_midia"
        onClick={() => handleCardClick('tipos_midia')}
      />
    </div>
  );
};

export default UserServiceStats;
