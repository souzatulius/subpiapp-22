
import React, { Suspense } from 'react';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

interface DynamicIconProps {
  iconId: string;
  className?: string;
  [key: string]: any;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ iconId, className, ...props }) => {
  const LoadIcon = React.lazy(() => {
    const importFunc = getIconComponentFromId(iconId);
    return importFunc();
  });
  
  return (
    <Suspense fallback={<div className={`bg-gray-200 animate-pulse rounded-full ${className}`} />}>
      <LoadIcon className={className} {...props} />
    </Suspense>
  );
};

export default DynamicIcon;
