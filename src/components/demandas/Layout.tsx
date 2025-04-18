
import React from 'react';
import FeedbackProvider from '@/components/ui/feedback-provider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="p-4 pb-32">
      {children}
    </div>
  );
};

export default Layout;
