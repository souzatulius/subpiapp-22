
import React from 'react';
import { Bell, Settings, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showControls = false, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <header className="w-full px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
      <div className="flex-1 flex justify-start">
        {showControls && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-4"
          >
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
        {showControls && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-[#003570]" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#f57c35] rounded-full"></span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5 text-[#003570]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-gray-100 rounded-full"
            >
              <User className="h-5 w-5 text-[#003570]" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
