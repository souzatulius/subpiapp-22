
import React from 'react';
import { Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import DashboardManagementContent from '@/components/settings/dashboard-management/DashboardManagementContent';

const DashboardManagement: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <WelcomeCard 
          title="Gerenciamento de Dashboards"
          description="Configure e personalize os dashboards para cada coordenação"
          icon={<Layout className="h-6 w-6 mr-2 text-white" />}
          color="bg-gradient-to-r from-blue-600 to-blue-800"
        />
        
        <div className="mt-6">
          <DashboardManagementContent />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardManagement;
