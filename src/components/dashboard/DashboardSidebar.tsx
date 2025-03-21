
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import SidebarSection from './sidebar/SidebarSection';
import { getNavigationSections } from './sidebar/navigationConfig';
import { useAdminCheck } from './sidebar/useAdminCheck';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen
}) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck(user);
  
  // Get navigation sections from config
  const navSections = getNavigationSections();

  return (
    <aside className={`bg-[#051b2c] transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex-shrink-0 overflow-x-hidden`}>
      <nav className="py-6">
        <ul className="space-y-2 px-3">
          {navSections.filter(section => !section.adminOnly || isAdmin).map((section) => (
            <li key={section.id} className="flex flex-col">
              <SidebarSection
                id={section.id}
                icon={section.icon}
                label={section.label}
                isSection={section.isSection}
                isOpen={isOpen}
                subSections={section.subSections}
                items={section.items}
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
