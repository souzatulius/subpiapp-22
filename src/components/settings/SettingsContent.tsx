
import React from 'react';
import UsersManagement from '@/components/settings/UsersManagement';
import CoordinationAreas from '@/components/settings/CoordinationAreas';
import Positions from '@/components/settings/Positions';
import Services from '@/components/settings/Services';
import MediaTypes from '@/components/settings/MediaTypes';
import DemandOrigins from '@/components/settings/DemandOrigins';
import DistrictsAndNeighborhoods from '@/components/settings/DistrictsAndNeighborhoods';
import Announcements from '@/components/settings/Announcements';
import AccessControl from '@/components/settings/AccessControl';
import SettingsDashboard from '@/components/settings/SettingsDashboard';

interface SettingsContentProps {
  activeSection: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ activeSection }) => {
  switch (activeSection) {
    case 'dashboard':
      return <SettingsDashboard />;
    case 'usuarios':
      return <UsersManagement />;
    case 'areas':
      return <CoordinationAreas />;
    case 'cargos':
      return <Positions />;
    case 'servicos':
      return <Services />;
    case 'tipos_midia':
      return <MediaTypes />;
    case 'origens_demanda':
      return <DemandOrigins />;
    case 'distritos_bairros':
      return <DistrictsAndNeighborhoods />;
    case 'comunicados':
      return <Announcements />;
    case 'permissoes':
      return <AccessControl />;
    default:
      return <UsersManagement />;
  }
};

export default SettingsContent;
