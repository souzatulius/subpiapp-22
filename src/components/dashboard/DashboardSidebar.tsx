
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import SidebarSection from './sidebar/SidebarSection';
import { getNavigationSections } from './sidebar/navigationConfig';
import { useAdminCheck } from './sidebar/useAdminCheck';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  isOpen: boolean;
  className?: string; // Add className prop
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  className = '' // Default to empty string
}) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck(user);
  const [collapsed, setCollapsed] = useState(!isOpen);
  
  // Get navigation sections from config
  const navSections = getNavigationSections();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`bg-[#051b2c] transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex-shrink-0 overflow-x-hidden relative ${className}`}>
      {/* Toggle button */}
      <div className="absolute right-[-12px] top-4 z-10">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          {collapsed ? 
            <ChevronRight className="h-4 w-4 text-[#051b2c]" /> : 
            <ChevronLeft className="h-4 w-4 text-[#051b2c]" />
          }
        </Button>
      </div>
      
      <nav className="py-6">
        <ul className="space-y-2 px-3">
          {navSections.map((section) => (
            <li key={section.id} className="flex flex-col">
              <SidebarSection
                id={section.id}
                icon={section.icon}
                label={section.label}
                isSection={section.isSection}
                isOpen={!collapsed}
                path={section.path}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
