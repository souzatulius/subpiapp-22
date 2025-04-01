
import React from 'react';
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileMenu from './ProfileMenu';
import { useLocation, Link } from 'react-router-dom';
import { NotificationsPopover } from './NotificationsPopover';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showControls = false, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if current page is a public page
  const isPublicPage = ['/login', '/register', '/forgot-password', '/email-verified', '/'].includes(location.pathname) || 
                      location.pathname.includes('/404');
  
  return (
    <header className="sticky top-0 bg-white border-b z-30 shadow-sm">
      {/* Main header row with logo and user controls */}
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          {/* Only show the menu toggle button if not on a public page */}
          {showControls && toggleSidebar && !isPublicPage && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 hidden md:flex" /* Hide on mobile */
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Logo centered in the header */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-10 flex items-center">
          <img 
            src="/lovable-uploads/f0e9c688-4d13-4dee-aa68-f4ac4292ad11.png" 
            alt="SUB-PI Logo" 
            className="h-full object-contain"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Only show user controls if not on a public page */}
          {!isPublicPage && (
            <>
              <NotificationsPopover />
              <ProfileMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
