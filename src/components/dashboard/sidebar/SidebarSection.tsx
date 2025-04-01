
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SectionItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarSectionProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  isSection: boolean;
  isOpen: boolean;
  items?: SectionItem[];
  path?: string;
  isActive?: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  id,
  icon,
  label,
  isSection,
  isOpen,
  items,
  path,
  isActive = false
}) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    [id]: true
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Improved function to check if a route is active
  const isRouteActive = (itemPath: string) => {
    if (!itemPath) return false;
    
    // Use the isActive prop passed from parent for top-level sections
    if (itemPath === path) {
      return isActive;
    }
    
    const isExactMatch = location.pathname === itemPath;
    const isChildRoute = location.pathname.startsWith(itemPath + '/');
    
    return isExactMatch || isChildRoute;
  };

  if (!isSection) {
    return (
      <NavLink 
        to={path || '#'} 
        className={`flex items-center px-4 py-3 rounded-xl mb-1 ${
          isActive ? 'bg-[#174ba9] text-white' : 'text-gray-300 hover:bg-[#0c2d45]'
        } transition-colors`}
      >
        <div className="flex-shrink-0 text-[#f57737]">{icon}</div>
        <span className={`ml-3 text-base ${isOpen ? 'block' : 'hidden'}`}>{label}</span>
      </NavLink>
    );
  }

  return (
    <>
      <button 
        onClick={() => toggleSection(id)}
        className="flex items-center px-4 py-3 text-gray-200 hover:bg-[#0c2d45] transition-colors font-medium rounded-xl mb-1 w-full"
        title={!isOpen ? label : undefined}
      >
        <div className="flex-shrink-0 text-[#f57737]">{icon}</div>
        {isOpen && (
          <span className="ml-3 text-base">{label}</span>
        )}
      </button>
      
      {isOpen && expandedSections[id] && items && (
        <ul className="ml-6 space-y-1 mt-1 mb-2 border-l-2 border-[#174ba9] pl-2">
          {items?.map((item, index) => (
            <li key={`${id}-item-${index}`}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => {
                  // Using our custom logic instead of NavLink's default logic
                  const isActiveRoute = isRouteActive(item.path);
                  return `flex items-center py-2 px-3 ${isActiveRoute ? 'text-[#f57737] bg-[#0c2d45]' : 'text-gray-300 hover:bg-[#0c2d45]'} rounded-xl transition-colors text-base`;
                }}
              >
                <div className="flex-shrink-0 mr-2 text-[#f57737]">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SidebarSection;
