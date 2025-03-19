
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      {children}
    </div>
  );
};

export default Layout;
