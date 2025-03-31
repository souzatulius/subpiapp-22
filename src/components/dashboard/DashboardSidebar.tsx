
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import SidebarSection from './sidebar/SidebarSection';
import { getNavigationSections } from './sidebar/navigationConfig';
import { useAdminCheck } from './sidebar/useAdminCheck';
import { useLocation } from 'react-router-dom';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen
}) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck(user);
  const location = useLocation();
  
  // Get navigation sections from config
  const navSections = getNavigationSections();

  // Improved function to determine which navigation item is active
  const getActiveSection = () => {
    // First, check for exact matches
    const exactMatch = navSections.find(section => section.path === location.pathname);
    if (exactMatch) return exactMatch.id;
    
    // Then check for parent paths, but be careful to find the most specific one
    // Sort paths by length descending to check the most specific paths first
    const sortedSections = [...navSections].sort(
      (a, b) => (b.path?.length || 0) - (a.path?.length || 0)
    );
    
    for (const section of sortedSections) {
      if (section.path && location.pathname.startsWith(section.path + '/')) {
        return section.id;
      }
    }
    
    return null;
  };

  const activeSectionId = getActiveSection();

  return (
    <aside className={`bg-[#051b2c] transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex-shrink-0 overflow-x-hidden`}>
      <nav className="py-6">
        <ul className="space-y-2 px-3">
          {navSections.map((section) => (
            <li key={section.id} className="flex flex-col">
              <SidebarSection
                id={section.id}
                icon={section.icon}
                label={section.label}
                isSection={section.isSection}
                isOpen={isOpen}
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
