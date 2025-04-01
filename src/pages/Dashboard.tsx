
import React from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useDashboardState } from '@/hooks/useDashboardState';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { useUser } from '@/hooks/useUser'; // Now this import should work
import { useMediaQuery } from '@/hooks/use-media-query';
import PageContainer from '@/components/layouts/PageContainer'; // Now this import should work
import { Skeleton } from '@/components/ui/skeleton';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser();
  const { 
    firstName, 
    actionCards, 
    setActionCards, 
    isLoading,
    editingCard,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    userCoordenaticaoId,
    handleSearchSubmit,
    handleQuickDemandSubmit,
    newDemandTitle,
    setNewDemandTitle,
    searchQuery,
    setSearchQuery,
    specialCardsData
  } = useDashboardState(user?.id);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header showControls={true} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          currentPath="/dashboard" 
        />
        
        <PageContainer>
          {isLoading ? (
            <div className="p-6 space-y-8">
              <Skeleton className="h-12 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            </div>
          ) : (
            <UnifiedDashboard
              userId={user?.id || ""}
              dashboardType="dashboard"
              title={`Olá, ${firstName}`}
              description="Bem-vindo(a) ao seu painel do SaadPi!"
              fallbackCards={actionCards}
            />
          )}
        </PageContainer>

        <CardCustomizationModal
          isOpen={isCustomizationModalOpen} 
          onClose={() => setIsCustomizationModalOpen(false)} 
          onSave={handleSaveCard}
          initialData={editingCard}
        />
      </div>
    </div>
  );
};

export default Dashboard;
