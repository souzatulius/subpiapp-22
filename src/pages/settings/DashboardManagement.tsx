
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardManagementContent from '@/components/settings/dashboard-management/DashboardManagementContent';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Settings, LayoutDashboard } from 'lucide-react';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';

const DashboardManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto">
            <div className="p-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
              >
                <WelcomeCard 
                  title="Gerenciamento de Dashboards" 
                  description="Configure e visualize os dashboards padrão para novos usuários" 
                  icon={<LayoutDashboard className="h-6 w-6 mr-2" />} 
                  color="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
                />
               
                <div className="mt-6">
                  <DashboardManagementContent />
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardManagement;
