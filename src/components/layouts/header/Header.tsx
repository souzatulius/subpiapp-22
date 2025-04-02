
import React from 'react';
import { Link } from 'react-router-dom';
import { NotificationsPopover } from './NotificationsPopover';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Menu } from 'lucide-react';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  showControls = false, 
  toggleSidebar 
}) => {
  const { session } = useAuth();
  const homeLink = session ? '/dashboard' : '/';
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-2 max-w-screen-2xl mx-auto">
        <div className="flex items-center">
          {showControls && toggleSidebar && (
            <button 
              onClick={toggleSidebar}
              className="mr-3 p-1 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <Link to={homeLink} className="flex items-center">
            <img 
              src="/lovable-uploads/a1cc6031-8d9a-4b53-b579-c990a3156837.png"
              alt="SMSUB Logo" 
              className="h-10 md:h-12"
            />
            <span className="sr-only">Sistema de Gestão de Demandas</span>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <NotificationsPopover />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
