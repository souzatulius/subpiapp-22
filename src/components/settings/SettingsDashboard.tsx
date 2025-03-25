import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Users, ListChecks, Briefcase, LayoutDashboard, MessageSquare, Bell, ShieldCheck } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, link }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <Settings className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          <Link to={link} className="hover:underline">{description}</Link>
        </p>
      </CardContent>
    </Card>
  );
};

const SettingsStats: React.FC = () => {
  return (
    <Card className="bg-blue-600 text-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Visão Geral
        </CardTitle>
        <Settings className="h-4 w-4 text-white opacity-75" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">Bem-vindo(a)!</p>
        <p className="text-sm text-white opacity-75">Acesso rápido às configurações do sistema.</p>
      </CardContent>
    </Card>
  );
};

const SettingsDashboard = () => {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SettingsStats />
      
      <SettingsCard
        title="Gerenciamento de Usuários"
        description="Adicione, edite e gerencie usuários do sistema."
        icon={<Users className="h-5 w-5" />}
        link="/settings?tab=usuarios"
      />
      
      <SettingsCard
        title="Lista de Coordenações e Supervisões"
        description="Veja a lista de coordenações e supervisões técnicas cadastradas."
        icon={<ListChecks className="h-5 w-5" />}
        link="/settings?tab=coordenacoes_lista"
      />
      
      <SettingsCard
        title="Supervisões Técnicas"
        description="Gerencie as áreas de supervisão técnica."
        icon={<Briefcase className="h-5 w-5" />}
        link="/settings?tab=areas"
      />
      
      <SettingsCard
        title="Coordenações"
        description="Gerencie as coordenações."
        icon={<Briefcase className="h-5 w-5" />}
        link="/settings?tab=coordenacao"
      />
      
      <SettingsCard
        title="Cargos"
        description="Gerencie os cargos dos usuários."
        icon={<ShieldCheck className="h-5 w-5" />}
        link="/settings?tab=cargos"
      />
      
      <SettingsCard
        title="Problemas"
        description="Gerencie os tipos de problemas."
        icon={<MessageSquare className="h-5 w-5" />}
        link="/settings?tab=problemas"
      />
      
      <SettingsCard
        title="Serviços"
        description="Gerencie os serviços oferecidos."
        icon={<Briefcase className="h-5 w-5" />}
        link="/settings?tab=servicos"
      />
      
      <SettingsCard
        title="Tipos de Mídia"
        description="Gerencie os tipos de mídia utilizados."
        icon={<Briefcase className="h-5 w-5" />}
        link="/settings?tab=tipos_midia"
      />
      
      <SettingsCard
        title="Origem das Demandas"
        description="Gerencie as origens das demandas."
        icon={<Briefcase className="h-5 w-5" />}
        link="/settings?tab=origens_demanda"
      />
      
      <SettingsCard
        title="Distritos e Bairros"
        description="Gerencie os distritos e bairros."
        icon={<Briefcase className="h-5 w-5" />}
        link="/settings?tab=distritos_bairros"
      />
      
      <SettingsCard
        title="Comunicados"
        description="Gerencie os comunicados."
        icon={<MessageSquare className="h-5 w-5" />}
        link="/settings?tab=comunicados"
      />
      
      <SettingsCard
        title="Permissões"
        description="Gerencie as permissões dos usuários."
        icon={<ShieldCheck className="h-5 w-5" />}
        link="/settings?tab=permissoes"
      />
      
      <SettingsCard
        title="Configurações de Notificações"
        description="Configure as notificações do sistema."
        icon={<Bell className="h-5 w-5" />}
        link="/settings?tab=notificacoes"
      />
      
      <SettingsCard
        title="Temas"
        description="Gerencie os temas."
        icon={<Briefcase className="h-5 w-5" />}
        link="/settings?tab=temas"
      />
    </div>
  );
};

export default SettingsDashboard;
