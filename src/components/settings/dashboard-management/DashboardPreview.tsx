
import React from 'react';
import CardGrid from '@/components/dashboard/CardGrid';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import ComunicacaoDashboard from '@/pages/dashboard/comunicacao/Comunicacao';
import DashboardActions from '@/components/dashboard/DashboardActions';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Smartphone, Monitor } from 'lucide-react';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  isMobilePreview: boolean;
  onAddNewCard?: () => void;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  dashboardType, 
  department,
  isMobilePreview,
  onAddNewCard 
}) => {
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

  const { user } = useAuth();
  const [modoAdmin, setModoAdmin] = React.useState(true);

  const handleAddCard = () => {
    if (onAddNewCard) {
      onAddNewCard();
    } else {
      handleAddNewCard();
    }
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
        <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
          {isMobilePreview ? <Smartphone className="mr-2 h-5 w-5" /> : <Monitor className="mr-2 h-5 w-5" />}
          Visualização da página de Comunicação {departmentName ? `- ${departmentName}` : ''}
        </h3>
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
      <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
        {isMobilePreview ? <Smartphone className="mr-2 h-5 w-5" /> : <Monitor className="mr-2 h-5 w-5" />}
        Visualização do Dashboard {departmentName ? `- ${departmentName}` : ''}
        
        <button
          className="ml-auto text-sm text-blue-600 underline"
          onClick={() => setModoAdmin((prev) => !prev)}
        >
          {modoAdmin ? '👁 Visualizar como usuário' : '⚙️ Modo admin'}
        </button>
      </h3>

      <div className={deviceFrameClasses}>
        {mobileNotch}
        <div className={`overflow-auto ${isMobilePreview ? 'h-[600px] pt-6' : 'h-[600px]'}`}>
          {modoAdmin && <DashboardActions onAddNewCard={handleAddCard} />}
          
          <div className="p-4">
            <CardGrid
              cards={cards}
              onCardsChange={setCards}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onAddNewCard={handleAddCard}
              specialCardsData={specialCardsData}
              isMobileView={isMobilePreview}
              modoAdmin={modoAdmin}
              coordenacaoId={department}
              usuarioId={user?.id ?? ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
