
import React from 'react';
import UsersManagement from './UsersManagement';
import Positions from './Positions';
import CoordinationAreas from './CoordinationAreas';
import CoordinationsList from './coordination/CoordinationsList';
import Services from './Services';
import DemandOrigins from './DemandOrigins';
import Problems from './Problems';
import MediaTypes from './MediaTypes';
import DistrictsAndNeighborhoods from './DistrictsAndNeighborhoods';
import Notifications from './Notifications';
import Announcements from './Announcements';
import { 
  Users, Briefcase, Building, Layers, 
  Globe, AlertTriangle, Image, FileText, MapPin,
  MessageSquare, Bell
} from 'lucide-react';
import SettingsSectionLayout from './SettingsSectionLayout';

interface SettingsContentProps {
  activeSection: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ activeSection }) => {
  // Function to get section color by id
  const getSectionColor = (section: string) => {
    if (['usuarios', 'permissoes', 'cargos'].includes(section)) return 'bg-amber-600';
    if (['coordenacoes_lista', 'areas', 'servicos'].includes(section)) return 'bg-blue-600';
    if (['origens_demanda', 'problemas', 'tipos_midia', 'distritos_bairros', 'notificacoes', 'comunicados'].includes(section)) return 'bg-green-600';
    return 'bg-gray-800';
  };
  
  // Function to get section info
  const getSectionInfo = (section: string) => {
    switch (section) {
      case 'usuarios':
        return {
          title: 'Usuários e Permissões',
          description: 'Gerencie contas de usuário, permissões e controle de acesso.',
          icon: <Users className="h-6 w-6" />,
          component: <UsersManagement />
        };
      case 'cargos':
        return {
          title: 'Cargos',
          description: 'Defina e gerencie cargos disponíveis para os usuários.',
          icon: <Briefcase className="h-6 w-6" />,
          component: <Positions />
        };
      case 'coordenacoes_lista':
        return {
          title: 'Coordenações',
          description: 'Gerencie as coordenações da subprefeitura.',
          icon: <Building className="h-6 w-6" />,
          component: <CoordinationsList />
        };
      case 'areas':
        return {
          title: 'Supervisões Técnicas',
          description: 'Configure as áreas de supervisão técnica.',
          icon: <Layers className="h-6 w-6" />,
          component: <CoordinationAreas />
        };
      case 'servicos':
        return {
          title: 'Serviços',
          description: 'Gerencie os serviços oferecidos pela prefeitura.',
          icon: <FileText className="h-6 w-6" />,
          component: <Services />
        };
      case 'origens_demanda':
        return {
          title: 'Origem das Demandas',
          description: 'Configure as possíveis origens de demandas.',
          icon: <Globe className="h-6 w-6" />,
          component: <DemandOrigins />
        };
      case 'problemas':
        return {
          title: 'Problemas/Temas',
          description: 'Gerencie temas e problemas para classificação de demandas.',
          icon: <AlertTriangle className="h-6 w-6" />,
          component: <Problems />
        };
      case 'tipos_midia':
        return {
          title: 'Tipos de Mídia',
          description: 'Configure os tipos de mídia disponíveis no sistema.',
          icon: <Image className="h-6 w-6" />,
          component: <MediaTypes />
        };
      case 'distritos_bairros':
        return {
          title: 'Distritos e Bairros',
          description: 'Gerencie distritos e bairros da cidade.',
          icon: <MapPin className="h-6 w-6" />,
          component: <DistrictsAndNeighborhoods />
        };
      case 'notificacoes':
        return {
          title: 'Notificações',
          description: 'Configure as notificações do sistema.',
          icon: <Bell className="h-6 w-6" />,
          component: <Notifications />
        };
      case 'comunicados':
        return {
          title: 'Avisos e Comunicados',
          description: 'Gerencie avisos, comunicados e notificações para os usuários.',
          icon: <MessageSquare className="h-6 w-6" />,
          component: <Announcements />
        };
      default:
        return {
          title: 'Configurações',
          description: '',
          icon: null,
          component: null
        };
    }
  };
  
  const sectionInfo = getSectionInfo(activeSection);
  const sectionColor = getSectionColor(activeSection);
  
  if (!sectionInfo.component) {
    return <div className="text-center py-10">Seção não encontrada.</div>;
  }
  
  return (
    <SettingsSectionLayout
      title={sectionInfo.title}
      description={sectionInfo.description}
      icon={sectionInfo.icon}
      color={sectionColor}
    >
      {sectionInfo.component}
    </SettingsSectionLayout>
  );
};

export default SettingsContent;
