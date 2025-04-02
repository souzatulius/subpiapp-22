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
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  id,
  icon,
  label,
  isSection,
  isOpen,
  subSections,
  items,
  path
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [id]: true
  });
  
  // Track if sidebar is currently being toggled
  const [isTogglingOpen, setIsTogglingOpen] = useState(false);
  const location = useLocation();

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

  // Custom isActive function for NavLink
  const isLinkActive = (itemPath: string) => {
    // For Dashboard, only highlight if it's exactly the dashboard path
    if (itemPath === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    
    // Special case for "Comunicação" - only active on exact match or non-relatorios paths
    if (itemPath === '/dashboard/comunicacao') {
      return location.pathname === '/dashboard/comunicacao' || 
             (location.pathname.startsWith('/dashboard/comunicacao/') && 
              !location.pathname.includes('/relatorios'));
    }
    
    // Special case for "Relatórios"
    if (itemPath === '/dashboard/comunicacao/relatorios') {
      return location.pathname.includes('/relatorios');
    }
    
    // For other items, highlight if the path matches exactly or if it's a subpath
    return location.pathname === itemPath || location.pathname.startsWith(itemPath + '/');
  };

  if (!isSection) {
    return (
      <NavLink 
        to={path || '#'} 
        className={({isActive}) => {
          // Override isActive with our custom logic
          const active = path ? isLinkActive(path) : false;
          return `flex items-center px-4 py-3 rounded-xl mb-1 ${active ? 'bg-[#174ba9] text-white' : 'text-gray-300 hover:bg-[#0c2d45]'} transition-colors`;
        }}
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
                        className={({isActive}) => {
                          // Override isActive with our custom logic
                          const active = isLinkActive(item.path);
                          return `flex items-center py-2 px-3 ${active ? 'text-[#f57737] bg-[#0c2d45]' : 'text-gray-300 hover:bg-[#0c2d45]'} rounded-xl transition-colors text-base`;
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
                className={({isActive}) => {
                  // Override isActive with our custom logic
                  const active = isLinkActive(item.path);
                  return `flex items-center py-2 px-3 ${active ? 'text-[#f57737] bg-[#0c2d45]' : 'text-gray-300 hover:bg-[#0c2d45]'} rounded-xl transition-colors text-base`;
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
