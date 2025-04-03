
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserProfileMenu } from './index';
import { Menu } from 'lucide-react';
import { useUserProfile } from './useUserProfile';

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
  
  // Get first and second name if available
  const getDisplayName = () => {
    if (!userProfile?.nome_completo) return '';
    const nameParts = userProfile.nome_completo.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0]} ${nameParts[1]}`;
    }
    return nameParts[0];
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Left side with menu toggle */}
        <div className="w-1/4 flex items-center">
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
            <div className="flex items-center">
              {userProfile && (
                <div className="text-right mr-3 hidden sm:block">
                  <p className="font-bold text-[#003570]">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">{userProfile.email}</p>
                </div>
              )}
              <UserProfileMenu />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
