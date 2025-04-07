
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface SidebarSectionProps {
  name: string;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    path: string;
  }>;
  isOpen: boolean;
  isActiveRoute: (route: string) => boolean;
  isActiveSection: (routes: string[]) => boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  name, 
  items, 
  isOpen, 
  isActiveRoute,
  isActiveSection
}) => {
  const paths = items.map(item => item.path);
  const isSectionActive = isActiveSection(paths);
  
  return (
    <div className="mb-6">
      {isOpen && (
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
          {name}
        </h3>
      )}
      
      <div className="space-y-1">
        {items.map((item, index) => (
          <NavLink
            key={`${name}-${index}`}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-2 py-2 text-sm rounded-md",
              isActive
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100",
              !isOpen && "justify-center"
            )}
          >
            <span className={cn(!isOpen && "w-6 h-6 flex items-center justify-center")}>
              {item.icon}
            </span>
            {isOpen && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SidebarSection;
