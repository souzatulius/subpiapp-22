
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, BarChart2, Settings, MessageSquare, CircleHelp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';
import { BarChart } from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-[#002855]",
          isActive
            ? "bg-[#EEF2F8] text-[#002855] font-medium"
            : "hover:bg-gray-100",
          isCollapsed ? "justify-center" : ""
        )
      }
    >
      <div className="flex-shrink-0">{icon}</div>
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const isMobile = useIsMobile();
  
  // Base sidebar width calculation
  const sidebarWidth = isOpen ? "w-64" : "w-16";
  const sidebarPadding = isOpen ? "px-4" : "px-2";
  
  return (
    <aside
      className={`${sidebarWidth} ${sidebarPadding} py-4 flex-shrink-0 border-r border-gray-200 bg-white h-full transition-all duration-300 ease-in-out`}
    >
      <nav className="space-y-2 flex flex-col h-full">
        <div className="space-y-1">
          <SidebarItem
            to="/dashboard"
            icon={<Home className="h-5 w-5" />}
            label="Página Inicial"
            isCollapsed={!isOpen}
          />
          <SidebarItem
            to="/dashboard/comunicacao/consultar"
            icon={<FileText className="h-5 w-5" />}
            label="Demandas"
            isCollapsed={!isOpen}
          />
          <SidebarItem
            to="/dashboard/comunicacao/notas"
            icon={<MessageSquare className="h-5 w-5" />}
            label="Notas Oficiais"
            isCollapsed={!isOpen}
          />
          <SidebarItem
            to="/dashboard/esic"
            icon={<CircleHelp className="h-5 w-5" />}
            label="e-SIC"
            isCollapsed={!isOpen}
          />
          <SidebarItem
            to="/dashboard/relatorios"
            icon={<BarChart className="h-5 w-5" />}
            label="Relatórios"
            isCollapsed={!isOpen}
          />
          <SidebarItem
            to="/dashboard/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Configurações"
            isCollapsed={!isOpen}
          />
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
