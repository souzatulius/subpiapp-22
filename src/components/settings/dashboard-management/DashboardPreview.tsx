
import React from 'react';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import ComunicacaoDashboard from '@/pages/dashboard/comunicacao/Comunicacao';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

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
    handleHideCard,
    specialCardsData,
    departmentName,
    isLoading
  } = useDefaultDashboardState(department);

  const { user } = useAuth();
  const [modoAdmin, setModoAdmin] = React.useState(true);

  // Handle cards change with proper type safety
  const handleCardsChange = (newCards: ActionCardItem[] | any[]) => {
    // Ensure proper ActionCardItem[] type is maintained
    setCards(newCards as ActionCardItem[]);
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

  // Handle drop event from card library
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (cardData && cardData.id) {
        // Create a new card with a unique ID
        const newCard: ActionCardItem = {
          ...cardData,
          id: `card-${uuidv4()}` // Generate a new unique ID
        };
        
        // Add the new card to the dashboard
        setCards([...cards, newCard]);
        
        toast({
          title: "Card adicionado",
          description: `O card "${newCard.title}" foi adicionado ao dashboard`,
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Error processing dropped card:", error);
    }
  };

  // Handle drag over to enable drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  if (dashboardType === 'communication') {
    return (
      <div className="bg-gray-50 p-6 h-full">
        <div className={deviceFrameClasses}>
          {mobileNotch}
          <div 
            className={`overflow-auto ${isMobilePreview ? 'h-[600px] pt-6' : 'h-[600px]'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
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
        <div 
          className={`overflow-auto ${isMobilePreview ? 'h-[600px] pt-6' : 'h-[600px]'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="p-4">
            <UnifiedCardGrid
              cards={cards}
              onCardsChange={handleCardsChange}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onHideCard={handleHideCard}
              isMobileView={isMobilePreview}
              isEditMode={modoAdmin}
              disableWiggleEffect={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
