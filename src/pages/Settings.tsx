
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useSupabaseAuth';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import SettingsContent from '@/components/settings/SettingsContent';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string>("usuarios");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden md:block bg-white w-64 border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#003570]">Ajustes da Plataforma</h2>
          </div>
          <nav className="p-2">
            <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {/* Mobile top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigate('/dashboard')}
                  className="md:flex"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl md:text-2xl font-bold text-[#003570]">Ajustes da Plataforma</h1>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const dropdown = document.getElementById('mobile-menu');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                >
                  Menu
                </Button>
              </div>
            </div>
            
            {/* Mobile dropdown menu */}
            <div id="mobile-menu" className="hidden md:hidden mb-6 bg-white rounded-lg shadow-sm p-2">
              <SettingsSidebar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                isMobile={true} 
              />
            </div>

            {/* Main content area */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <SettingsContent activeSection={activeSection} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
