
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserProfileMenu } from './index';
import { useUserProfile } from './useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
  hideUserMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showControls = false, 
  toggleSidebar,
  hideUserMenu = false
}) => {
  const { userProfile } = useUserProfile();
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="w-full flex h-16 items-center justify-between">
        {/* Left side - Removido o botão de menu */}
        <div className="w-1/4 flex items-center gap-4 relative">
          {/* Espaço vazio onde estava o botão de menu */}
        </div>
        
        {/* Center - Logo */}
        <div className="w-2/4 flex justify-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/003ae508-4951-4978-a94b-35490e166867.png" 
              alt="SUB-PI Logo" 
              className="h-12"
            />
          </Link>
        </div>
        
        {/* Right side - User profile */}
        <div className="w-1/4 flex items-center justify-end">
          {showControls && !hideUserMenu && (
            <UserProfileMenu />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
