
import React, { useState, useEffect } from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  isMobilePreview?: boolean;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  dashboardType, 
  department,
  isMobilePreview = false
}) => {
  const {
    cards,
    setCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleHideCard,
    handleEditCard,
    handleSaveCard,
    specialCardsData,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  } = useDefaultDashboardState(department);

  return (
    <div className="p-4">
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-medium mb-4">
          {dashboardType === 'dashboard' ? 'Visualização do Dashboard' : 'Visualização da Comunicação'}
        </h3>
        
        {cards.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            Nenhum card configurado. Adicione cards para visualizar o dashboard.
          </div>
        ) : (
          <UnifiedCardGrid 
            cards={cards}
            onCardsChange={setCards}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onHideCard={handleHideCard}
            isMobileView={isMobilePreview}
            isEditMode={true}
            // Enable special features
            showSpecialFeatures={true}
            quickDemandTitle={newDemandTitle}
            onQuickDemandTitleChange={setNewDemandTitle}
            onQuickDemandSubmit={handleQuickDemandSubmit}
            onSearchSubmit={handleSearchSubmit}
            specialCardsData={specialCardsData}
          />
        )}
      </div>
      
      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard || undefined}
      />
    </div>
  );
};

export default DashboardPreview;
