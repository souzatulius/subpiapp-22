
import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Building, Layers, 
  Globe, AlertTriangle, Image, FileText, MapPin,
  MessageSquare, Bell, Settings, Shield, UserCheck
} from 'lucide-react';
import SettingsCard from './components/SettingsCard';
import MiniBarChart from './components/MiniBarChart';
import MiniDonutChart from './components/MiniDonutChart';
import StatCard from './components/StatCard';
import { usePositions } from '@/hooks/usePositions';
import { useProblemsData } from '@/hooks/useProblems';
import { useServices } from '@/hooks/services';
import { useCoordinationAreas } from '@/hooks/coordination-areas/useCoordinationAreas';
import { useDemandOrigins } from '@/hooks/useDemandOrigins';
import { useMediaTypes } from '@/hooks/useMediaTypes';
import { Card, CardContent } from '@/components/ui/card';

interface SettingsDashboardProps {
  searchQuery?: string;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ searchQuery = '' }) => {
  // Fetch counts from hooks
  const { positions, loading: positionsLoading } = usePositions();
  const { problems, isLoading: problemsLoading } = useProblemsData();
  const { services, loading: servicesLoading } = useServices();
  const { areas, coordinations, loading: areasLoading } = useCoordinationAreas();
  const { origins, loading: originsLoading } = useDemandOrigins();
  const { mediaTypes, loading: mediaTypesLoading } = useMediaTypes();
  
  // Sample data for charts (replace with real data when available)
  const usersByRoleData = [
    { name: 'Admin', value: 5 },
    { name: 'Editor', value: 12 },
    { name: 'Viewer', value: 25 }
  ];
  
  const servicesByAreaData = [
    { name: 'Zeladoria', value: 12 },
    { name: 'Comunicação', value: 8 },
    { name: 'Jurídico', value: 5 }
  ];
  
  const coordsByUsageData = [
    { name: 'Coord A', value: 45 },
    { name: 'Coord B', value: 32 },
    { name: 'Coord C', value: 28 },
    { name: 'Coord D', value: 15 }
  ];

  // Filter cards based on search query
  const filterCards = (cards: any[]) => {
    if (!searchQuery) return cards;
    
    return cards.filter(card => 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // Define cards configuration
  const cards = [
    {
      title: "Usuários e Permissões",
      description: "Gerencie usuários e suas permissões de acesso no sistema.",
      icon: <Users className="h-5 w-5" />,
      link: "/settings?tab=usuarios",
      color: "bg-amber-600",
      count: 42,
      category: "Gestão de Usuários e Permissões",
      chart: <MiniDonutChart data={usersByRoleData} />
    },
    {
      title: "Cargos",
      description: "Gerencie os cargos dos usuários.",
      icon: <Briefcase className="h-5 w-5" />,
      link: "/settings?tab=cargos",
      color: "bg-amber-600",
      count: positions?.length || 0,
      category: "Gestão de Usuários e Permissões",
      loading: positionsLoading
    },
    {
      title: "Permissões",
      description: "Configure permissões de acesso ao sistema.",
      icon: <Shield className="h-5 w-5" />,
      link: "/settings?tab=permissoes",
      color: "bg-amber-600",
      count: 9,
      category: "Gestão de Usuários e Permissões",
      chart: <MiniBarChart data={[
        { name: 'Ver', value: 15 },
        { name: 'Editar', value: 10 },
        { name: 'Admin', value: 6 }
      ]} color="#f59e0b" />
    },
    {
      title: "Coordenações",
      description: "Gerencie as coordenações.",
      icon: <Building className="h-5 w-5" />,
      link: "/settings?tab=coordenacoes_lista",
      color: "bg-blue-600",
      count: coordinations?.length || 0,
      category: "Gestão Organizacional",
      loading: areasLoading,
      chart: <MiniBarChart data={coordsByUsageData} />
    },
    {
      title: "Supervisões Técnicas",
      description: "Gerencie as áreas de supervisão técnica.",
      icon: <Layers className="h-5 w-5" />,
      link: "/settings?tab=areas",
      color: "bg-blue-600",
      count: areas?.length || 0,
      category: "Gestão Organizacional",
      loading: areasLoading
    },
    {
      title: "Serviços",
      description: "Gerencie os serviços oferecidos.",
      icon: <FileText className="h-5 w-5" />,
      link: "/settings?tab=servicos",
      color: "bg-blue-600",
      count: services?.length || 0,
      category: "Gestão Organizacional",
      loading: servicesLoading,
      chart: <MiniBarChart data={servicesByAreaData} color="#2563eb" />
    },
    {
      title: "Origens das Demandas",
      description: "Gerencie as origens das demandas.",
      icon: <Globe className="h-5 w-5" />,
      link: "/settings?tab=origens_demanda",
      color: "bg-green-600",
      count: origins?.length || 0,
      category: "Gestão Operacional",
      loading: originsLoading
    },
    {
      title: "Problemas/Temas",
      description: "Gerencie temas e problemas para demandas.",
      icon: <AlertTriangle className="h-5 w-5" />,
      link: "/settings?tab=problemas",
      color: "bg-green-600",
      count: problems?.length || 0,
      category: "Gestão Operacional",
      loading: problemsLoading
    },
    {
      title: "Tipos de Mídia",
      description: "Gerencie os tipos de mídia utilizados.",
      icon: <Image className="h-5 w-5" />,
      link: "/settings?tab=tipos_midia",
      color: "bg-green-600",
      count: mediaTypes?.length || 0,
      category: "Gestão Operacional",
      loading: mediaTypesLoading
    },
    {
      title: "Distritos e Bairros",
      description: "Gerencie os distritos e bairros.",
      icon: <MapPin className="h-5 w-5" />,
      link: "/settings?tab=distritos_bairros",
      color: "bg-green-600",
      count: 38,
      category: "Gestão Operacional",
      chart: <MiniDonutChart data={[
        { name: 'Centro', value: 12 },
        { name: 'Norte', value: 9 },
        { name: 'Sul', value: 7 },
        { name: 'Leste', value: 10 }
      ]} colors={["#22c55e", "#4ade80", "#86efac", "#dcfce7"]} />
    },
    {
      title: "Notificações",
      description: "Configure as notificações do sistema.",
      icon: <Bell className="h-5 w-5" />,
      link: "/settings?tab=notificacoes",
      color: "bg-green-600",
      category: "Gestão Operacional"
    },
    {
      title: "Avisos e Comunicados",
      description: "Gerencie os avisos e comunicados do sistema.",
      icon: <MessageSquare className="h-5 w-5" />,
      link: "/settings?tab=comunicados",
      color: "bg-green-600",
      count: 14,
      category: "Gestão Operacional"
    }
  ];
  
  // Filter cards based on search
  const filteredCards = filterCards(cards);
  
  // Group cards by category
  const categorizedCards = filteredCards.reduce((acc: Record<string, any[]>, card) => {
    const category = card.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(card);
    return acc;
  }, {});
  
  if (filteredCards.length === 0 && searchQuery) {
    return (
      <div className="w-full py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-medium text-gray-900">Nenhuma configuração encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Não encontramos configurações correspondentes a "{searchQuery}".
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-10">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Settings className="h-6 w-6 mr-2" />
                Central de Configurações
              </h2>
              <p className="text-blue-100">
                Gerencie todas as configurações do sistema em um só lugar.
              </p>
            </div>
            <div className="flex space-x-4">
              <StatCard 
                title="Usuários" 
                value={42} 
                icon={<UserCheck size={18} />}
                description="Gerenciar usuários" 
                section="usuarios"
                highlight={true}
                unreadCount={5}
                onClick={() => window.location.href = '/settings?tab=usuarios'}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cards by Category */}
      {Object.entries(categorizedCards).map(([category, categoryCards]) => (
        <div key={category}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((card, index) => (
              <SettingsCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                link={card.link}
                color={card.color}
                count={card.count}
                category={card.category}
              >
                {card.chart}
                {card.loading && (
                  <div className="animate-pulse mt-2 h-20 bg-gray-200 rounded"></div>
                )}
              </SettingsCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsDashboard;
