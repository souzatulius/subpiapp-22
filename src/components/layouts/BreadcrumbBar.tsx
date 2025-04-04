
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList
} from '@/components/ui/breadcrumb';
import { getBreadcrumbItems } from './breadcrumb/breadcrumbUtils';
import BreadcrumbItemComponent from './breadcrumb/BreadcrumbItem';

interface BreadcrumbBarProps {
  onSettingsClick?: () => void;
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ onSettingsClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleClick = (path: string) => {
    if (path.includes('settings') && onSettingsClick) {
      onSettingsClick();
      return;
    }
    
    navigate(path);
  };
  
  const breadcrumbItems = getBreadcrumbItems(location.pathname);
  
  return (
    <div className="px-6 py-2 text-xs text-gray-500">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItemComponent
              key={index}
              item={item}
              index={index}
              handleClick={handleClick}
            />
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbBar;
