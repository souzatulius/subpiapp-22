
import React from 'react';
import UsersManagement from './users/UsersManagement';
import Positions from './Positions';
import CoordinationsManager from './coordination/CoordinationsManager';
import Problems from './Problems';
import Services from './Services';
import DemandOrigins from './DemandOrigins';
import MediaTypes from './MediaTypes';
import DistrictsAndNeighborhoods from './DistrictsAndNeighborhoods';
import Notifications from './Notifications';
import Announcements from './Announcements';
import AccessControl from './AccessControl';
import { Navigate } from 'react-router-dom';

interface SettingsContentProps {
  activeSection: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ activeSection }) => {
  if (activeSection === 'usuarios') {
    return <UsersManagement />;
  } else if (activeSection === 'permissoes') {
    return <AccessControl />;
  } else if (activeSection === 'cargos') {
    return <Positions />;
  } else if (activeSection === 'coordenacoes_lista' || activeSection === 'areas') {
    return <CoordinationsManager />;
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
  } else if (activeSection === 'dashboard_management') {
    return <Navigate to="/settings/dashboard-management" />;
  }

  return <div>Selecione uma seção para configurar</div>;
};

export default SettingsContent;
