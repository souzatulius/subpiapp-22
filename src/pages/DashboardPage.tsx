
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import DashboardActions from '@/components/dashboard/DashboardActions';
import DynamicDataCard from '@/components/dashboard/DynamicDataCard';
import QuickDemandCard from '@/components/dashboard/QuickDemandCard';
import SmartSearchCard from '@/components/dashboard/SmartSearchCard';
import CardGrid from '@/components/dashboard/CardGrid';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';
import { useDashboardState } from '@/hooks/useDashboardState';
import { UnifiedActionCard } from '@/components/dashboard/UnifiedActionCard';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';
import EditCardModal from '@/components/dashboard/EditCardModal';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import EditModeToggle from '@/components/dashboard/EditModeToggle';

const DashboardPage: React.FC = () => {
  const { viewType, isLoadingDashboard } = useDashboardState();
  const { firstName } = useDashboardConfig();

  return (
    <div className="container py-6 space-y-8">
      <header className="space-y-2">
        <div className="flex justify-between items-center">
          <WelcomeMessage />
          <EditModeToggle 
            isEditMode={false} 
            onToggle={() => {}} 
          />
        </div>
        <DashboardHeader />
      </header>

      <DashboardActions />
      
      <div className="grid grid-cols-1 gap-6">
        <UnifiedCardGrid />
      </div>
    </div>
  );
};

export default DashboardPage;
