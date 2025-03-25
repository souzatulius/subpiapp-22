
import React from 'react';
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileMenu from './ProfileMenu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from 'react-router-dom';
import { NotificationsPopover } from './NotificationsPopover';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showControls = false, toggleSidebar }) => {
  const location = useLocation();
  
  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    
    if (paths.length === 0) return null;
    
    return (
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          
          {paths.map((path, index) => {
            const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
            const href = `/${paths.slice(0, index + 1).join('/')}`;
            
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === paths.length - 1 ? (
                    <span className="font-medium">{formattedPath}</span>
                  ) : (
                    <BreadcrumbLink href={href}>{formattedPath}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };
  
  return (
    <header className="sticky top-0 bg-white border-b z-30 h-16 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-3">
        {showControls && toggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-0" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="h-10 flex items-center">
          <img 
            src="/lovable-uploads/f0e9c688-4d13-4dee-aa68-f4ac4292ad11.png" 
            alt="SUB-PI Logo" 
            className="h-full object-contain"
          />
        </div>
        
        {generateBreadcrumbs()}
      </div>
      
      <div className="flex items-center space-x-2">
        <NotificationsPopover />
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Header;
