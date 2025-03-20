
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NotificationsPopover from './header/NotificationsPopover';
import ProfileMenu from './header/ProfileMenu';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  showControls = false,
  toggleSidebar
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-2">
        {showControls && toggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <img 
          src="/lovable-uploads/ae208fd7-3f16-427a-a087-135128e4be50.png" 
          alt="Logo" 
          className="h-8" 
        />
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <NotificationsPopover />
          <ProfileMenu />
        </div>
      )}
    </header>
  );
};

export default Header;
