
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import SettingsContent from '@/components/settings/SettingsContent';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-56' : 'w-16'
        } flex-shrink-0 overflow-x-hidden p-4`}>
          <SettingsSidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
        </div>
        
        <main className="flex-1 overflow-auto p-6">
          <SettingsContent activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
};

export default Settings;
