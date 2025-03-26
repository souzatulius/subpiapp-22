
import React from 'react';
import UsersManagement from './users/UsersManagement';
import Positions from './Positions';
import CoordinationAreas from './CoordinationAreas';
import Problems from './Problems';
import Services from './Services';
import DemandOrigins from './DemandOrigins';
import MediaTypes from './MediaTypes';
import DistrictsAndNeighborhoods from './DistrictsAndNeighborhoods';
import Notifications from './Notifications';
import Announcements from './Announcements';

interface SettingsContentProps {
  activeSection: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ activeSection }) => {
  if (activeSection === 'usuarios') {
    return <UsersManagement />;
  } else if (activeSection === 'cargos') {
    return <Positions />;
  } else if (activeSection === 'coordenacoes_lista') {
    return <CoordinationAreas />;
  } else if (activeSection === 'areas') {
    return <CoordinationAreas />;
  } else if (activeSection === 'problemas') {
    return <Problems />;
  } else if (activeSection === 'servicos') {
    // Added logging to debug
    console.log('Rendering Services component');
    return <Services />;
  } else if (activeSection === 'origens_demanda') {
    return <DemandOrigins />;
  } else if (activeSection === 'tipos_midia') {
    return <MediaTypes />;
  } else if (activeSection === 'distritos_bairros') {
    return <DistrictsAndNeighborhoods />;
  } else if (activeSection === 'notificacoes') {
    return <Notifications />;
  } else if (activeSection === 'comunicados') {
    return <Announcements />;
  }

  return <div>Selecione uma seção para configurar</div>;
};

export default SettingsContent;
