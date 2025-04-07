
import React from 'react';
import { NavLink } from 'react-router-dom';
import { getNavigationSections } from '@/components/dashboard/sidebar/navigationConfig';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';

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
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-[#f57737]",
          isActive
            ? "bg-[#003570] text-[#f57737] font-medium"
            : "text-gray-300 hover:bg-[#0035701a]",
          isCollapsed ? "justify-center" : ""
        )
      }
    >
      <div className="flex-shrink-0 w-10 h-10">{icon}</div>
      {!isCollapsed && <span className="text-lg font-bold">{label}</span>}
    </NavLink>
  );
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const isMobile = useIsMobile();
  
  // Base sidebar width calculation
  const sidebarWidth = isOpen ? "w-64" : "w-16";
  const sidebarPadding = isOpen ? "px-4" : "px-2";
  
  // Get navigation items from centralized config
  const navigationItems = getNavigationSections();
  
  return (
    <aside
      className={`${sidebarWidth} ${sidebarPadding} py-4 flex-shrink-0 border-r border-[#00357033] bg-[#051b2c] h-screen sticky top-0 transition-all duration-300 ease-in-out`}
    >
      <nav className="space-y-2 flex flex-col h-full">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isCollapsed={!isOpen}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
