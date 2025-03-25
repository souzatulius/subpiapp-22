
import React from 'react';
import { Bell, Users, Briefcase, FileStack, Image, Inbox, MapPin, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SettingsCard
        icon={<Users className="h-8 w-8" />}
        title="Usuários"
        description="Gerencie os usuários do sistema, atribua permissões e papéis"
        to="/settings?tab=usuarios"
      />
      
      <SettingsCard
        icon={<Bell className="h-8 w-8" />}
        title="Notificações"
        description="Configure as notificações do sistema e preferências dos usuários"
        to="/settings?tab=notificacoes"
      />
      
      <SettingsCard
        icon={<Briefcase className="h-8 w-8" />}
        title="Cargos"
        description="Adicione, edite e gerencie os cargos disponíveis"
        to="/settings?tab=cargos"
      />
      
      <SettingsCard
        icon={<AlertTriangle className="h-8 w-8" />}
        title="Problemas"
        description="Gerencie os problemas associados às áreas de coordenação"
        to="/settings?tab=problemas"
      />
      
      <SettingsCard
        icon={<FileStack className="h-8 w-8" />}
        title="Serviços"
        description="Gerencie os serviços oferecidos pelas áreas de coordenação"
        to="/settings?tab=servicos"
      />
      
      <SettingsCard
        icon={<Image className="h-8 w-8" />}
        title="Tipos de Mídia"
        description="Configure os tipos de mídia para as demandas"
        to="/settings?tab=tipos_midia"
      />
      
      <SettingsCard
        icon={<Inbox className="h-8 w-8" />}
        title="Origem das Demandas"
        description="Gerencie as possíveis origens das demandas"
        to="/settings?tab=origens_demanda"
      />
      
      <SettingsCard
        icon={<MapPin className="h-8 w-8" />}
        title="Distritos e Bairros"
        description="Organize os distritos e bairros da cidade"
        to="/settings?tab=distritos_bairros"
      />
      
      {/* Outros cards de ajustes... */}
    </div>
  );
};

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ icon, title, description, to }) => {
  return (
    <Link to={to} className="block">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-lg text-gray-900">{title}</h3>
            <p className="text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SettingsDashboard;
