
import React from 'react';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import ComunicacaoDashboard from '@/pages/dashboard/comunicacao/Comunicacao';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { ActionCardItem } from '@/types/dashboard';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  isMobilePreview: boolean;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  dashboardType, 
  department,
  isMobilePreview
}) => {
  const {
    cards,
    setCards,
    handleDeleteCard,
    handleEditCard,
    specialCardsData,
    departmentName
  } = useDefaultDashboardState(department);

  const { user } = useAuth();
  const [modoAdmin, setModoAdmin] = React.useState(true);

  // Handle cards change in a type-safe way
  const handleCardsChange = (newCards: ActionCardItem[] | any[]) => {
    // Ensure that the input is properly cast to ActionCardItem[]
    setCards(newCards.map(card => ({
      ...card,
      type: card.type || 'standard', // Ensure type is always set
      path: card.path || '', // Ensure path is always set
    })) as ActionCardItem[]);
  };

  // Create device frame classes based on preview mode
  const deviceFrameClasses = isMobilePreview 
    ? "max-w-[375px] mx-auto border-[8px] border-gray-800 rounded-[36px] overflow-hidden shadow-xl bg-white p-0 h-[640px] relative" 
    : "border-[16px] border-gray-800 rounded-xl overflow-hidden shadow-xl bg-white max-w-full relative";
  
  // Add notch for mobile preview
  const mobileNotch = isMobilePreview && (
    <div className="absolute top-0 left-0 w-full flex justify-center">
      <div className="h-5 w-36 bg-gray-800 rounded-b-xl"></div>
    </div>
  );

  if (dashboardType === 'communication') {
    return (
      <div className="bg-gray-50 p-6 h-full">
        <div className={deviceFrameClasses}>
          {mobileNotch}
          <div className={`overflow-auto ${isMobilePreview ? 'h-[600px] pt-6' : 'h-[600px]'}`}>
            <ComunicacaoDashboard isPreview={true} department={department} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 h-full">
      <div className={deviceFrameClasses}>
        {mobileNotch}
        <div className={`overflow-auto ${isMobilePreview ? 'h-[600px] pt-6' : 'h-[600px]'}`}>
          <div className="p-4">
            <UnifiedCardGrid
              cards={cards}
              onCardsChange={handleCardsChange}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              isMobileView={isMobilePreview}
              isEditMode={modoAdmin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
