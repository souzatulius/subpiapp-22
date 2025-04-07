
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useNavigate } from 'react-router-dom';
import { SettingsMenu } from '@/components/settings/SettingsMenu';
import MobileSettingsNav from '@/components/settings/MobileSettingsNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettingsContent } from '@/hooks/useSettingsContent';
import { Layout } from '@/components/demandas';
import useUserProfiles from '@/hooks/useUserProfiles';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState('profile');
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { renderSettingsContent } = useSettingsContent(selectedOption);
  const { loading } = useUserProfiles();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSettingSelect = (optionId: string) => {
    setSelectedOption(optionId);
    if (isMobile) {
      setSettingsMenuOpen(false);
    }
  };

  const handleSettingsClick = () => {
    setSettingsMenuOpen(!settingsMenuOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isMobile ? (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white">
          <BreadcrumbBar />
        </div>
      ) : (
        <Header showControls={true} toggleSidebar={toggleSidebar} />
      )}

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}

        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          {!isMobile && <BreadcrumbBar />}

          <Layout>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row gap-6 relative">
                {isMobile ? (
                  <MobileSettingsNav
                    isOpen={settingsMenuOpen}
                    onOptionSelect={handleSettingSelect}
                    selectedOption={selectedOption}
                  />
                ) : (
                  <div className="w-64 flex-shrink-0">
                    <SettingsMenu
                      selectedOption={selectedOption}
                      onOptionSelect={handleSettingSelect}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {renderSettingsContent()}
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        </div>
      </div>

      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Settings;
