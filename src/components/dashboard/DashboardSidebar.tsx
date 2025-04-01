
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from './sidebar/useAdminCheck';
import SidebarSection from './sidebar/SidebarSection';
import { navigationConfig } from './sidebar/navigationConfig';

export interface DashboardSidebarProps {
  isOpen: boolean;
  currentPath?: string; // Make currentPath optional
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  currentPath = '/dashboard' // Default to dashboard path
}) => {
  const navigate = useNavigate();
  const { isAdmin } = useAdminCheck();
  
  // Filter sections based on admin status
  const filteredSections = navigationConfig.sections.filter(
    section => !section.adminOnly || isAdmin
  );
  
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 md:transition-none`}
    >
      <div className="flex flex-col h-full pt-16 overflow-y-auto">
        <div className="flex-1 px-3 py-4 space-y-6">
          {filteredSections.map((section) => (
            <SidebarSection 
              key={section.id}
              title={section.title}
              items={section.items}
              currentPath={currentPath}
              onNavigate={(path) => navigate(path)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
