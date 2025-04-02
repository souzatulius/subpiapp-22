
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import NotificationsPopover from './NotificationsPopover';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
  hideUserMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showControls = true,
  toggleSidebar,
  hideUserMenu = false
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-2 max-w-screen-2xl mx-auto">
        {/* Left section */}
        <div className="flex items-center w-1/3">
          {showControls && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 md:hidden"
              data-sidebar="trigger"
            >
              <Menu size={24} />
            </button>
          )}
        </div>
        
        {/* Center section - Logo */}
        <div className="flex items-center justify-center w-1/3">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/a94cbbfc-b0c9-4e5c-86e2-9f9db452dca3.png"
              alt="Logo"
              className="h-12 md:h-12"
            />
          </Link>
        </div>
        
        {/* Right section - User controls */}
        <div className="flex items-center justify-end space-x-3 w-1/3">
          {!hideUserMenu && (
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
