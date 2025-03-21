
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';
import { useAuth } from '@/hooks/useSupabaseAuth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardActions from '@/components/dashboard/DashboardActions';
import CardGrid from '@/components/dashboard/CardGrid';
import { useDashboardState } from '@/hooks/useDashboardState';

const Dashboard = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  const {
    firstName,
    actionCards,
    setActionCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    // Quick demand functionality
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    // Search functionality
    handleSearchSubmit
  } = useDashboardState(user?.id);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <DashboardHeader firstName={firstName} />
            
            <DashboardActions onAddNewCard={handleAddNewCard} />
            
            <CardGrid 
              cards={actionCards}
              onCardsChange={setActionCards}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              quickDemandTitle={newDemandTitle}
              onQuickDemandTitleChange={setNewDemandTitle}
              onQuickDemandSubmit={handleQuickDemandSubmit}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>
        </main>
      </div>
      
      {/* Card Customization Modal */}
      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard || undefined}
      />
    </div>
  );
};

export default Dashboard;
