
import React from 'react';
import CardGrid from '@/components/dashboard/CardGrid';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import ComunicacaoDashboard from '@/pages/dashboard/comunicacao/Comunicacao';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ dashboardType, department }) => {
  const {
    cards,
    setCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    specialCardsData
  } = useDefaultDashboardState(department);

  if (dashboardType === 'communication') {
    return (
      <div className="bg-gray-50 p-6">
        <h3 className="text-lg font-medium mb-4 text-gray-700">
          Visualização da página de Comunicação {department !== 'default' ? `- ${department}` : ''}
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <ComunicacaoDashboard isPreview={true} department={department} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <h3 className="text-lg font-medium mb-4 text-gray-700">
        Visualização do Dashboard {department !== 'default' ? `- ${department}` : ''}
      </h3>
      
      <CardGrid
        cards={cards}
        onCardsChange={setCards}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onAddNewCard={handleAddNewCard}
        specialCardsData={specialCardsData}
      />
    </div>
  );
};

export default DashboardPreview;
