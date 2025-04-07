
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SidebarSectionProps {
  title: string;
  items: {
    icon: React.ReactNode;
    label: string;
    path: string;
  }[];
  isOpen: boolean;
  isActiveRoute: (route: string) => boolean;
  isActiveSection: (routes: string[]) => boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  items,
  isOpen,
  isActiveRoute,
  isActiveSection
}) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const sectionPaths = items.map(item => item.path);
  const isActive = isActiveSection(sectionPaths);
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  const handleItemClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="mb-4">
      <div 
        className={cn(
          "flex items-center justify-between py-1 px-2 rounded-md cursor-pointer",
          isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
        )}
        onClick={toggleCollapse}
      >
        <span className={cn(
          "font-medium text-sm transition-all",
          isOpen ? "opacity-100" : "opacity-0"
        )}>
          {title}
        </span>
        {isOpen && (
          collapsed ? 
          <ChevronRight className="h-4 w-4" /> : 
          <ChevronDown className="h-4 w-4" />
        )}
      </div>
      
      {!collapsed && (
        <div className="mt-1 space-y-1">
          {items.map((item, index) => (
            <Button
              key={`item-${index}`}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActiveRoute(item.path) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => handleItemClick(item.path)}
            >
              <div className="flex items-center gap-3">
                <div className={isActiveRoute(item.path) ? "text-blue-600" : ""}>
                  {item.icon}
                </div>
                <span className={cn(
                  "text-sm transition-all",
                  isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}>
                  {item.label}
                </span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarSection;
