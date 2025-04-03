
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useSupabaseAuth';
import UserProfileMenu from './UserProfileMenu';
import { NotificationsPopover } from './NotificationsPopover';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showControls = true,
  toggleSidebar,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-4 py-2 max-w-screen-2xl mx-auto">
        {/* Left section */}
        <div className="flex items-center w-1/3">
          {showControls && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Center section - Logo */}
        <div className="flex items-center justify-center w-1/3">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/a94cbbfc-b0c9-4e5c-86e2-9f9db452dca3.png"
              alt="SUBPI Logo"
              className="h-12 md:h-12"
            />
          </Link>
        </div>

        {/* Right section - User profile and notifications */}
        <div className="flex items-center justify-end space-x-3 w-1/3">
          {user && (
            <>
              <NotificationsPopover />
              <UserProfileMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
