
import React from 'react';
import { Link } from 'react-router-dom';
import NotificationsPopover from './NotificationsPopover';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '@/hooks/useSupabaseAuth';

const Header = () => {
  const { session } = useAuth();
  const homeLink = session ? '/dashboard' : '/';
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-2 max-w-screen-2xl mx-auto">
        <Link to={homeLink} className="flex items-center">
          <img 
            src="/lovable-uploads/a1cc6031-8d9a-4b53-b579-c990a3156837.png"
            alt="SMSUB Logo" 
            className="h-10 md:h-12"
          />
          <span className="sr-only">Sistema de Gestão de Demandas</span>
        </Link>
        <div className="flex items-center space-x-3">
          <NotificationsPopover />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
