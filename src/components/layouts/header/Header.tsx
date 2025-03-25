
import React from 'react';
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from '.';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showControls = false, toggleSidebar }) => {
  return (
    <header className="sticky top-0 bg-white border-b z-30 h-16 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center">
        {showControls && toggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <span className="text-xl font-semibold">Dashboard</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Header;
