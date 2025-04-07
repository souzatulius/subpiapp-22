
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

interface BreadcrumbBarProps {
  className?: string; // Add className prop
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ className = '' }) => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs(location.pathname);

  return (
    <div className={`bg-white border-b border-gray-200 py-2 px-4 ${className}`}>
      <div className="flex items-center text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            )}
            <span 
              className={`
                ${index === breadcrumbs.length - 1 
                  ? 'font-medium text-gray-900' 
                  : 'text-gray-500'
                }
              `}
            >
              {breadcrumb.label}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BreadcrumbBar;
