
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import SidebarSection from './sidebar/SidebarSection';
import { useAdminCheck } from './sidebar/useAdminCheck';
import { navigationConfig } from './sidebar/navigationConfig';

interface DashboardSidebarProps {
  isOpen: boolean;
  className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useAdminCheck();
  
  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };
  
  const isActiveSection = (routes: string[]) => {
    return routes.some(route => location.pathname.startsWith(route));
  };
  
  return (
    <aside 
      className={cn(
        "w-56 h-full bg-white border-r border-gray-200 transition-all overflow-hidden",
        isOpen ? "lg:w-56" : "lg:w-16",
        className
      )}
    >
      <ScrollArea className="h-full px-3">
        <div className="py-4">
          {navigationConfig.map((section, index) => {
            // Skip admin section for non-admin users
            if (section.title === 'Admin' && !isAdmin) {
              return null;
            }
            
            return (
              <SidebarSection
                key={`section-${index}`}
                title={section.title}
                items={section.items}
                isOpen={isOpen}
                isActiveRoute={isActiveRoute}
                isActiveSection={isActiveSection}
              />
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default DashboardSidebar;
