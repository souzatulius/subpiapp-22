
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isSection) {
    return (
      <NavLink 
        to={path || '#'} 
        className={({isActive}) => `flex items-center px-4 py-2 ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
      >
        <div className="flex-shrink-0">{icon}</div>
        <span className={`ml-3 ${isOpen ? 'block' : 'hidden'}`}>{label}</span>
      </NavLink>
    );
  }

  return (
    <>
      <button 
        onClick={() => toggleSection(id)}
        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-medium"
      >
        <div className="flex-shrink-0">{icon}</div>
        {isOpen && (
          <span className="ml-3">{label}</span>
        )}
      </button>
      
      {isOpen && expandedSections[id] && subSections && (
        <>
          {subSections.map((subSection) => (
            <div key={subSection.id} className="ml-4 mt-1">
              <button 
                onClick={() => toggleSection(subSection.id)}
                className="flex items-center px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors w-full text-left text-sm font-medium"
              >
                <span>{subSection.label}</span>
              </button>
              
              {expandedSections[subSection.id] && (
                <ul className="ml-2 space-y-1">
                  {subSection.items?.map((item, index) => (
                    <li key={`${subSection.id}-item-${index}`}>
                      <NavLink 
                        to={item.path} 
                        className={({isActive}) => `flex items-center py-1.5 px-3 ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors text-sm`}
                      >
                        <div className="flex-shrink-0 mr-2">{item.icon}</div>
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
        <ul className="ml-6 space-y-1 mt-1">
          {items?.map((item, index) => (
            <li key={`${id}-item-${index}`}>
              <NavLink 
                to={item.path} 
                className={({isActive}) => `flex items-center py-1.5 px-2 ${isActive ? 'text-[#003570] bg-blue-50' : 'text-gray-600 hover:bg-gray-100'} rounded-md transition-colors text-sm`}
              >
                <div className="flex-shrink-0 mr-2">{item.icon}</div>
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
