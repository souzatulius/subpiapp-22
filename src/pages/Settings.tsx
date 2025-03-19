
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import SettingsContent from '@/components/settings/SettingsContent';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <SettingsSidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <SettingsContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default Settings;
