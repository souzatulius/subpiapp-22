
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import SidebarSection from './sidebar/SidebarSection';
import { navigationConfig } from './sidebar/navigationConfig';

export interface DashboardSidebarProps {
  isOpen: boolean;
  currentPath?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  currentPath = '/dashboard'
}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Check if user is admin
  const isAdmin = React.useMemo(() => {
    // Simple admin check - you might want to replace with actual logic
    return user?.email?.includes('admin') || false;
  }, [user]);
  
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
              id={section.id}
              label={section.title}
              icon={section.items[0]?.icon || null}
              isSection={false}
              isOpen={isOpen}
              items={section.items}
              path={section.items[0]?.path}
              isActive={currentPath.startsWith(section.items[0]?.path)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
