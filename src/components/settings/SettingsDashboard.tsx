
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookText, Briefcase, FileSignature, Newspaper, Map, MessageCircle, Bell, Shield, Home, Layers, Building } from 'lucide-react';
import { useSettingsStats } from './hooks/useSettingsStats';
import StatCard from './components/StatCard';
import LocationCommunicationStats from './components/LocationCommunicationStats';
import UserServiceStats from './components/UserServiceStats';

const SettingsDashboard = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useSettingsStats();

  const handleCategoryClick = (category: string) => {
    navigate(`/settings?tab=${category}`);
  };

  const categories = [
    {
      id: 'usuarios',
      title: 'Usuários',
      icon: <Users className="h-6 w-6" />,
      description: 'Gerencie os usuários da plataforma',
      count: stats.usuarios
    },
    {
      id: 'areas',
      title: 'Áreas de Coordenação',
      icon: <Briefcase className="h-6 w-6" />,
      description: 'Gerencie as áreas de coordenação',
      count: stats.areasCoordenacao
    },
    {
      id: 'coordenacao',
      title: 'Coordenações',
      icon: <Building className="h-6 w-6" />,
      description: 'Gerencie as coordenações',
      count: stats.coordenacoes || 0
    },
    {
      id: 'cargos',
      title: 'Cargos',
      icon: <BookText className="h-6 w-6" />,
      description: 'Gerencie os cargos disponíveis',
      count: stats.cargos
    },
    {
      id: 'temas',
      title: 'Temas',
      icon: <Layers className="h-6 w-6" />,
      description: 'Gerencie os temas disponíveis',
      count: stats.problemas
    },
    {
      id: 'servicos',
      title: 'Serviços',
      icon: <FileSignature className="h-6 w-6" />,
      description: 'Gerencie os serviços disponíveis',
      count: stats.servicos
    },
    {
      id: 'tipos_midia',
      title: 'Tipos de Mídia',
      icon: <Newspaper className="h-6 w-6" />,
      description: 'Gerencie os tipos de mídia',
      count: stats.tiposMidia
    },
    {
      id: 'origens_demanda',
      title: 'Origens das Demandas',
      icon: <Home className="h-6 w-6" />,
      description: 'Gerencie as origens das demandas',
      count: stats.origensDemanda
    },
    {
      id: 'distritos_bairros',
      title: 'Distritos e Bairros',
      icon: <Map className="h-6 w-6" />,
      description: 'Gerencie distritos e bairros',
      count: stats.distritos + stats.bairros
    },
    {
      id: 'comunicados',
      title: 'Comunicados',
      icon: <MessageCircle className="h-6 w-6" />,
      description: 'Gerencie os comunicados',
      count: stats.comunicados
    },
    {
      id: 'notificacoes',
      title: 'Configurações de Notificações',
      icon: <Bell className="h-6 w-6" />,
      description: 'Configure as notificações do sistema',
      count: stats.configuracoesNotificacoes
    },
    {
      id: 'permissoes',
      title: 'Permissões',
      icon: <Shield className="h-6 w-6" />,
      description: 'Gerencie as permissões dos usuários',
      count: stats.permissoes
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map(category => (
          <StatCard
            key={category.id}
            title={category.title}
            icon={category.icon}
            description={category.description}
            count={isLoading ? null : category.count}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LocationCommunicationStats stats={stats} isLoading={isLoading} />
        <UserServiceStats stats={stats} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SettingsDashboard;
