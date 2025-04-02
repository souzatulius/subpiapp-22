
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Building2,
  Building,
  Wrench,
  Edit,
  Bell,
  MessageSquare,
  LayoutDashboard
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SettingsCategoryProps {
  title: string;
  icon: React.ReactNode;
  to: string;
}

const SettingsCategory: React.FC<SettingsCategoryProps> = ({ title, icon, to }) => {
  return (
    <Link to={to}>
      <Card 
        className="p-6 flex flex-col items-center justify-center h-full hover:shadow-lg transition-shadow group"
      >
        <div className="rounded-full p-3 bg-gray-100 group-hover:bg-blue-50 mb-3 transition-colors">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-center">{title}</h3>
      </Card>
    </Link>
  );
};

interface SettingsDashboardProps {
  searchQuery?: string;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ searchQuery = '' }) => {
  const categories = [
    {
      id: 'usuarios',
      title: 'Usuários e Permissões',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      to: '/settings?tab=usuarios'
    },
    {
      id: 'cargos',
      title: 'Cargos',
      icon: <Briefcase className="h-6 w-6 text-green-600" />,
      to: '/settings?tab=cargos'
    },
    {
      id: 'coordenacoes',
      title: 'Coordenações',
      icon: <Building2 className="h-6 w-6 text-orange-600" />,
      to: '/settings?tab=coordenacoes_lista'
    },
    {
      id: 'supervisoes',
      title: 'Supervisões Técnicas',
      icon: <Building className="h-6 w-6 text-purple-600" />,
      to: '/settings?tab=areas'
    },
    {
      id: 'servicos',
      title: 'Serviços',
      icon: <Wrench className="h-6 w-6 text-cyan-600" />,
      to: '/settings?tab=servicos'
    },
    {
      id: 'problemas',
      title: 'Problemas/Temas',
      icon: <Edit className="h-6 w-6 text-red-600" />,
      to: '/settings?tab=problemas'
    },
    {
      id: 'notificacoes',
      title: 'Notificações',
      icon: <Bell className="h-6 w-6 text-amber-600" />,
      to: '/settings?tab=notificacoes'
    },
    {
      id: 'comunicados',
      title: 'Avisos e Comunicados',
      icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
      to: '/settings?tab=comunicados'
    },
    {
      id: 'dashboard_management',
      title: 'Gerenciamento de Dashboards',
      icon: <LayoutDashboard className="h-6 w-6 text-blue-600" />,
      to: '/settings?tab=dashboard_management'
    }
  ];

  const filteredCategories = searchQuery 
    ? categories.filter(category => 
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações do Sistema</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(category => (
          <SettingsCategory 
            key={category.id}
            title={category.title}
            icon={category.icon}
            to={category.to}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsDashboard;
