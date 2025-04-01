
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = ""
}) => {
  return (
    <div className={`flex flex-col flex-1 p-4 md:p-6 overflow-auto ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
