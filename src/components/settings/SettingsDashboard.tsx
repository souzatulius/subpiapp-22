
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Settings, Users, ListChecks, Briefcase, LayoutDashboard, 
  MessageSquare, Bell, ShieldCheck, Building, UserCheck, 
  Globe, AlertTriangle, Image, FileText, MapPin, Send, Map,
  Layers // Add the missing Layers icon import
} from 'lucide-react';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, link, color = "bg-blue-600" }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${color} text-white rounded-t-xl`}>
        <CardTitle className="text-sm font-medium flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <Settings className="h-4 w-4 text-white opacity-75" />
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500">
          <Link to={link} className="hover:underline">{description}</Link>
        </p>
      </CardContent>
    </Card>
  );
};

const CategoryTitle = ({ title, icon, color }: { title: string; icon: React.ReactNode; color: string }) => (
  <div className={`col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-2 px-4 py-2 ${color} text-white rounded-lg shadow mt-6 mb-2`}>
    {icon}
    <h2 className="text-xl font-semibold">{title}</h2>
  </div>
);

const SettingsDashboard = () => {
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-blue-600 text-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Configurações do Sistema
          </CardTitle>
          <Settings className="h-4 w-4 text-white opacity-75" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">Bem-vindo(a)!</p>
          <p className="text-sm text-white opacity-75">Configurações organizadas para facilitar a gestão do sistema.</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* GESTÃO DE USUÁRIOS E PERMISSÕES */}
        <CategoryTitle 
          title="Gestão de Usuários e Permissões" 
          icon={<Users className="h-6 w-6" />} 
          color="bg-amber-600" 
        />
        
        <SettingsCard
          title="Gerenciamento de Usuários"
          description="Adicione, edite e gerencie usuários do sistema."
          icon={<Users className="h-5 w-5" />}
          link="/settings?tab=usuarios"
          color="bg-amber-600"
        />
        
        <SettingsCard
          title="Permissões e Acessos"
          description="Configure as permissões e acessos dos usuários."
          icon={<ShieldCheck className="h-5 w-5" />}
          link="/settings?tab=permissoes"
          color="bg-amber-600"
        />
        
        {/* GESTÃO ORGANIZACIONAL */}
        <CategoryTitle 
          title="Gestão Organizacional" 
          icon={<Building className="h-6 w-6" />} 
          color="bg-blue-600" 
        />
        
        <SettingsCard
          title="Cargos"
          description="Gerencie os cargos dos usuários."
          icon={<Briefcase className="h-5 w-5" />}
          link="/settings?tab=cargos"
          color="bg-blue-600"
        />
        
        <SettingsCard
          title="Coordenações"
          description="Gerencie as coordenações."
          icon={<Building className="h-5 w-5" />}
          link="/settings?tab=coordenacao"
          color="bg-blue-600"
        />
        
        <SettingsCard
          title="Supervisões Técnicas"
          description="Gerencie as áreas de supervisão técnica."
          icon={<Layers className="h-5 w-5" />}
          link="/settings?tab=areas"
          color="bg-blue-600"
        />
        
        <SettingsCard
          title="Equipe e Responsabilidades"
          description="Gerencie as equipes e suas responsabilidades."
          icon={<UserCheck className="h-5 w-5" />}
          link="/settings?tab=equipes"
          color="bg-blue-600"
        />
        
        {/* GESTÃO OPERACIONAL */}
        <CategoryTitle 
          title="Gestão Operacional" 
          icon={<Settings className="h-6 w-6" />} 
          color="bg-green-600" 
        />
        
        <SettingsCard
          title="Origens das Demandas"
          description="Gerencie as origens das demandas."
          icon={<Globe className="h-5 w-5" />}
          link="/settings?tab=origens_demanda"
          color="bg-green-600"
        />
        
        <SettingsCard
          title="Problemas"
          description="Gerencie os tipos de problemas."
          icon={<AlertTriangle className="h-5 w-5" />}
          link="/settings?tab=problemas"
          color="bg-green-600"
        />
        
        <SettingsCard
          title="Tipos de Mídia"
          description="Gerencie os tipos de mídia utilizados."
          icon={<Image className="h-5 w-5" />}
          link="/settings?tab=tipos_midia"
          color="bg-green-600"
        />
        
        <SettingsCard
          title="Serviços"
          description="Gerencie os serviços oferecidos."
          icon={<FileText className="h-5 w-5" />}
          link="/settings?tab=servicos"
          color="bg-green-600"
        />
        
        <SettingsCard
          title="Distritos e Bairros"
          description="Gerencie os distritos e bairros."
          icon={<MapPin className="h-5 w-5" />}
          link="/settings?tab=distritos_bairros"
          color="bg-green-600"
        />
        
        <SettingsCard
          title="Notificações"
          description="Configure as notificações do sistema."
          icon={<Bell className="h-5 w-5" />}
          link="/settings?tab=notificacoes"
          color="bg-green-600"
        />
        
        <SettingsCard
          title="Avisos e Comunicados"
          description="Gerencie os avisos e comunicados do sistema."
          icon={<MessageSquare className="h-5 w-5" />}
          link="/settings?tab=comunicados"
          color="bg-green-600"
        />
        
        {/* OTHER SETTINGS */}
        <CategoryTitle 
          title="Outros Ajustes" 
          icon={<Settings className="h-6 w-6" />} 
          color="bg-gray-600" 
        />
        
        <SettingsCard
          title="Temas"
          description="Gerencie os temas do sistema."
          icon={<Image className="h-5 w-5" />}
          link="/settings?tab=temas"
          color="bg-gray-600"
        />
      </div>
    </div>
  );
};

export default SettingsDashboard;
