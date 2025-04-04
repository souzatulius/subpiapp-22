
import React from 'react';
import { Home } from 'lucide-react';
import {
  BreadcrumbItem as BreadcrumbItemUI,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { BreadcrumbItem as BreadcrumbItemType } from './breadcrumbUtils';

interface BreadcrumbItemProps {
  item: BreadcrumbItemType;
  index: number;
  handleClick: (path: string) => void;
}

const BreadcrumbItemComponent: React.FC<BreadcrumbItemProps> = ({ 
  item, 
  index, 
  handleClick 
}) => {
  return (
    <React.Fragment>
      {index > 0 && <BreadcrumbSeparator />}
      <BreadcrumbItemUI>
        <BreadcrumbLink asChild>
          <button 
            onClick={() => handleClick(item.path)}
            className="hover:text-gray-700 whitespace-nowrap flex items-center"
          >
            {index === 0 && <Home className="h-3 w-3 mr-1" />}
            <span>{item.label}</span>
          </button>
        </BreadcrumbLink>
      </BreadcrumbItemUI>
    </React.Fragment>
  );
};

export default BreadcrumbItemComponent;
