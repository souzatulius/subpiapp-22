import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SubSection {
  id: string;
  label: string;
  isSubSection?: boolean;
  items?: {
    icon: React.ReactNode;
    label: string;
    path: string;
  }[];
}

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
  subSections?: SubSection[];
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
  subSections,
  items,
  path,
  isActive = false
}) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [id]: true
  });
  
  // Track if sidebar is currently being toggled
  const [isTogglingOpen, setIsTogglingOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle click on section when sidebar is collapsed
  const handleSectionClick = () => {
    if (isSection && !isOpen) {
      // Set toggling state to true
      setIsTogglingOpen(true);
      
      // Force open the sidebar by simulating a click on the sidebar toggle
      const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]');
      if (sidebarTrigger) {
        sidebarTrigger.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      }
      
      // Ensure section is expanded after sidebar opens
      setExpandedSections(prev => ({
        ...prev,
        [id]: true
      }));
    } else {
      toggleSection(id);
    }
  };
  
  // Reset the toggling state when sidebar opens
  useEffect(() => {
    if (isOpen && isTogglingOpen) {
      setIsTogglingOpen(false);
    }
  }, [isOpen, isTogglingOpen]);

  // Improved function to check if a route is active
  const isRouteActive = (itemPath: string) => {
    if (!itemPath) return false;
    
    // Use the isActive prop passed from parent for top-level sections
    if (itemPath === path) {
      return isActive;
    }
    
    const isExactMatch = location.pathname === itemPath;
    const isChildRoute = location.pathname.startsWith(itemPath + '/');
    
    // If we're on a child route, we need to check if there's a more specific match
    // among the other navigation items to avoid multiple active items
    let isMoreSpecificMatch = false;
    
    if (isChildRoute) {
      // Check subsections and their items
      const allRoutes: string[] = [];
      
      // Collect all possible routes from subsections
      subSections?.forEach(subSection => {
        subSection.items?.forEach(item => {
          if (item.path && item.path !== itemPath) {
            allRoutes.push(item.path);
          }
        });
      });
      
      // Collect all routes from direct items
      items?.forEach(item => {
        if (item.path && item.path !== itemPath) {
          allRoutes.push(item.path);
        }
      });
      
      // Check if there's a more specific route that matches the current location
      isMoreSpecificMatch = allRoutes.some(route => 
        route.startsWith(itemPath + '/') && location.pathname.startsWith(route)
      );
    }
    
    return isExactMatch || (isChildRoute && !isMoreSpecificMatch);
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
        onClick={handleSectionClick}
        className="flex items-center px-4 py-3 text-gray-200 hover:bg-[#0c2d45] transition-colors font-medium rounded-xl mb-1 w-full"
        title={!isOpen ? label : undefined}
      >
        <div className="flex-shrink-0 text-[#f57737]">{icon}</div>
        {isOpen && (
          <span className="ml-3 text-base">{label}</span>
        )}
      </button>
      
      {isOpen && expandedSections[id] && subSections && (
        <>
          {subSections.map((subSection) => (
            <div key={subSection.id} className="ml-3 mt-1 mb-2">
              <button 
                onClick={() => toggleSection(subSection.id)}
                className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#0c2d45] transition-colors w-full text-left text-base font-medium rounded-xl"
              >
                <span>{subSection.label}</span>
              </button>
              
              {expandedSections[subSection.id] && (
                <ul className="ml-2 space-y-1 mt-1 border-l-2 border-[#174ba9] pl-2">
                  {subSection.items?.map((item, index) => (
                    <li key={`${subSection.id}-item-${index}`}>
                      <NavLink 
                        to={item.path} 
                        className={({ isActive }) => {
                          // Using our improved custom logic instead of NavLink's default logic
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
            </div>
          ))}
        </>
      )}
      
      {isOpen && expandedSections[id] && items && (
        <ul className="ml-6 space-y-1 mt-1 mb-2 border-l-2 border-[#174ba9] pl-2">
          {items?.map((item, index) => (
            <li key={`${id}-item-${index}`}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => {
                  // Using our improved custom logic instead of NavLink's default logic
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
