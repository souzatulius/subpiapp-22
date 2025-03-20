
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationsPopover } from './header/NotificationsPopover';
import { ProfileMenu } from './header/ProfileMenu';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showControls = false,
  toggleSidebar
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="w-full px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
      <div className="flex-1 flex justify-start">
        {showControls && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4 px-0">
            <Menu className="h-5 w-5 text-[#003570]" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 flex justify-center">
        <img 
          src="/lovable-uploads/a1cc6031-8d9a-4b53-b579-c990a3156837.png" 
          alt="Logo Prefeitura de São Paulo" 
          className="h-10" 
        />
      </div>
      
      <div className="flex-1 flex justify-end">
        {showControls && user && (
          <div className="flex items-center gap-2">
            <NotificationsPopover />
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5 text-[#003570]" />
            </Button>
            <ProfileMenu />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
