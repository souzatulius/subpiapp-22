
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserProfileMenu } from './index';
import { Menu } from 'lucide-react';
import logo from '/public/lovable-uploads/5b8c78fb-e26a-45d0-844e-df1dea58037b.png';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showControls = false, toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          {showControls && toggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-8" />
            <span className="font-medium hidden sm:inline-block">Sistema de Gestão</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {showControls && (
            <UserProfileMenu />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
