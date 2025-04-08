
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import useBreadcrumbPaths from '@/hooks/useBreadcrumbPaths';

interface BreadcrumbBarProps {
  onSettingsClick?: () => void;
  className?: string;
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ onSettingsClick, className = '' }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { breadcrumbItems } = useBreadcrumbPaths();
  
  const handleNavigate = (path: string) => {
    // If this is a settings path and we have a special handler, use it
    if (path.includes('/settings') && onSettingsClick) {
      onSettingsClick();
      return;
    }
    
    navigate(path);
  };
  
  return (
    <div className={`px-4 py-1.5 text-xs text-gray-500 ${isMobile ? 'bg-white shadow-sm' : ''} ${className}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={() => navigate('/dashboard')} className="flex items-center hover:text-gray-700">
                <Home className="h-3 w-3 mr-1" />
                <span>Início</span>
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {breadcrumbItems && breadcrumbItems.length > 0 && breadcrumbItems.map((item, index) => {
            // Skip the first item (dashboard/início) since we already have the home icon
            if (item.path === '/dashboard') return null;
            
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <button 
                      onClick={() => handleNavigate(item.path)}
                      className="hover:text-gray-700 whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbBar;
