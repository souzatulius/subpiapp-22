import React, { useState } from 'react';
import CardGrid from '@/components/dashboard/CardGrid';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import ComunicacaoDashboard from '@/pages/dashboard/comunicacao/Comunicacao';
import DashboardActions from '@/components/dashboard/DashboardActions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
    specialCardsData,
    departmentName
  } = useDefaultDashboardState(department);

  const [isMobilePreview, setIsMobilePreview] = useState(false);

  if (dashboardType === 'communication') {
    return (
      <div className="bg-gray-50 p-6">
        <h3 className="text-lg font-medium mb-4 text-gray-700">
          Visualização da página de Comunicação {departmentName ? `- ${departmentName}` : ''}
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <ComunicacaoDashboard isPreview={true} department={department} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">
          Visualização do Dashboard {departmentName ? `- ${departmentName}` : ''}
        </h3>

        <div className="flex items-center space-x-2">
          <Label htmlFor="mobile-preview" className="text-sm text-gray-600">Modo Mobile</Label>
          <Switch
            id="mobile-preview"
            checked={isMobilePreview}
            onCheckedChange={setIsMobilePreview}
          />
        </div>
      </div>

      <DashboardActions onAddNewCard={handleAddNewCard} />

      <CardGrid
        cards={cards}
        onCardsChange={setCards}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onAddNewCard={handleAddNewCard}
        specialCardsData={specialCardsData}
        isMobileView={isMobilePreview}
      />
    </div>
  );
};

export default DashboardPreview;
