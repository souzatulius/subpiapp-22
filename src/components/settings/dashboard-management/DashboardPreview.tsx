
import React, { useState } from 'react';
import CardGrid from '@/components/dashboard/CardGrid';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import ComunicacaoDashboard from '@/pages/dashboard/comunicacao/Comunicacao';
import DashboardActions from '@/components/dashboard/DashboardActions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Smartphone, Monitor } from 'lucide-react';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  onAddNewCard?: () => void;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  dashboardType, 
  department,
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
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [modoAdmin, setModoAdmin] = useState(true);

  const handleAddCard = () => {
    if (onAddNewCard) {
      onAddNewCard();
    } else {
      handleAddNewCard();
    }
  };

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

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="mobile-preview"
              checked={isMobilePreview}
              onCheckedChange={setIsMobilePreview}
            />
            <Label htmlFor="mobile-preview" className="flex items-center text-sm text-gray-600">
              {isMobilePreview ? (
                <>
                  <Smartphone className="h-4 w-4 mr-1" /> 
                  Mobile
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4 mr-1" /> 
                  Desktop
                </>
              )}
            </Label>
          </div>
          <button
            className="text-sm text-blue-600 underline"
            onClick={() => setModoAdmin((prev) => !prev)}
          >
            {modoAdmin ? '👁 Visualizar como usuário' : '⚙️ Modo admin'}
          </button>
        </div>
      </div>

      {modoAdmin && <DashboardActions onAddNewCard={handleAddCard} />}

      <div className={isMobilePreview ? "max-w-sm mx-auto border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg bg-white p-2" : ""}>
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
  );
};

export default DashboardPreview;
