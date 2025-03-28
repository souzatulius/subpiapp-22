import React from 'react';
import { 
  Users, Briefcase, Building, Layers, 
  Globe, AlertTriangle, Image, FileText, MapPin,
  MessageSquare, Bell, Settings, Shield, UserCheck,
  LayoutDashboard
} from 'lucide-react';
import MiniBarChart from '../components/MiniBarChart';
import MiniDonutChart from '../components/MiniDonutChart';

// Sample data for charts (replace with real data when available)
export const getUsersByRoleData = () => [
  { name: 'Admin', value: 5 },
  { name: 'Editor', value: 12 },
  { name: 'Viewer', value: 25 }
];

export const getServicesByAreaData = () => [
  { name: 'Zeladoria', value: 12 },
  { name: 'Comunicação', value: 8 },
  { name: 'Jurídico', value: 5 }
];

export const getCoordsUsageData = () => [
  { name: 'Coord A', value: 45 },
  { name: 'Coord B', value: 32 },
  { name: 'Coord C', value: 28 },
  { name: 'Coord D', value: 15 }
];

export const userManagementCards = [
  {
    title: "Usuários e Permissões",
    description: "Gerencie usuários e suas permissões de acesso no sistema.",
    icon: <Users className="h-5 w-5" />,
    link: "/settings?tab=usuarios",
    color: "bg-amber-600",
    count: 42,
    category: "Gestão de Usuários e Permissões",
    chart: <MiniDonutChart data={getUsersByRoleData()} />
  },
  {
    title: "Cargos",
    description: "Gerencie os cargos dos usuários.",
    icon: <Briefcase className="h-5 w-5" />,
    link: "/settings?tab=cargos",
    color: "bg-amber-600",
    count: 15,
    category: "Gestão de Usuários e Permissões"
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
  }
];

export const organizationalCards = [
  {
    title: "Coordenações",
    description: "Gerencie as coordenações.",
    icon: <Building className="h-5 w-5" />,
    link: "/settings?tab=coordenacoes_lista",
    color: "bg-blue-600",
    count: 4,
    category: "Gestão Organizacional",
    chart: <MiniBarChart data={getCoordsUsageData()} />
  },
  {
    title: "Supervisões Técnicas",
    description: "Gerencie as áreas de supervisão técnica.",
    icon: <Layers className="h-5 w-5" />,
    link: "/settings?tab=areas",
    color: "bg-blue-600",
    count: 12,
    category: "Gestão Organizacional"
  },
  {
    title: "Serviços",
    description: "Gerencie os serviços oferecidos.",
    icon: <FileText className="h-5 w-5" />,
    link: "/settings?tab=servicos",
    color: "bg-blue-600",
    count: 24,
    category: "Gestão Organizacional",
    chart: <MiniBarChart data={getServicesByAreaData()} color="#2563eb" />
  },
  {
    title: "Gerenciamento de Dashboards",
    description: "Configure os dashboards padrão para cada coordenação.",
    icon: <LayoutDashboard className="h-5 w-5" />,
    link: "/settings/dashboard-management",
    color: "bg-blue-600",
    category: "Gestão Organizacional"
  }
];

export const operationalCards = [
  {
    title: "Origens das Demandas",
    description: "Gerencie as origens das demandas.",
    icon: <Globe className="h-5 w-5" />,
    link: "/settings?tab=origens_demanda",
    color: "bg-green-600",
    count: 8,
    category: "Gestão Operacional"
  },
  {
    title: "Problemas/Temas",
    description: "Gerencie temas e problemas para demandas.",
    icon: <AlertTriangle className="h-5 w-5" />,
    link: "/settings?tab=problemas",
    color: "bg-green-600",
    count: 32,
    category: "Gestão Operacional"
  },
  {
    title: "Tipos de Mídia",
    description: "Gerencie os tipos de mídia utilizados.",
    icon: <Image className="h-5 w-5" />,
    link: "/settings?tab=tipos_midia",
    color: "bg-green-600",
    count: 6,
    category: "Gestão Operacional"
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

// Function to filter cards based on search query
export const filterCards = (cards: any[], searchQuery: string) => {
  if (!searchQuery) return cards;
  
  return cards.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

// Get all cards
export const getSettingsCards = () => {
  return [...userManagementCards, ...organizationalCards, ...operationalCards];
};

// Function to group cards by category
export const groupCardsByCategory = (cards: any[]) => {
  return cards.reduce((acc: Record<string, any[]>, card) => {
    const category = card.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(card);
    return acc;
  }, {});
};
