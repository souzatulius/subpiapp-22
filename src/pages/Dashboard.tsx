
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';
import { useAuth } from '@/hooks/useSupabaseAuth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CardGrid from '@/components/dashboard/CardGrid';
import { useDashboardState } from '@/hooks/useDashboardState';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Home, PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ActionCardItem } from '@/hooks/dashboard/types';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';

const Dashboard = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
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
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    // Special cards data
    specialCardsData
  } = useDashboardState(user?.id);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Adapt the handler to match CardCustomizationModal's expected format
  const handleSaveCardAdapter = (data: { 
    title: string; 
    icon: React.ReactNode; 
    path: string;
    color: ActionCardItem['color'];
    width?: ActionCardItem['width'];
    height?: ActionCardItem['height'];
    type?: ActionCardItem['type'];
    dataSourceKey?: string;
    allowedDepartments?: string[];
    allowedRoles?: string[];
    displayMobile?: boolean;
    mobileOrder?: number;
  }) => {
    // Extract iconId from the icon component
    const iconComponent = data.icon;
    
    // Pass the full data to the original handler
    handleSaveCard({
      ...data,
      iconId: editingCard?.iconId || 'clipboard-list', // Use existing or default
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - explicitly pass showControls={true} */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <WelcomeCard
              title={`Olá, ${firstName || 'Usuário'}!`}
              description="Organize esta área do seu jeito, movendo ou ocultando os cards."
              icon={<Home className="h-6 w-6 mr-2" />}
              showButton={true}
              buttonText="+ Card"
              buttonIcon={<PlusCircle className="h-4 w-4" />}
              buttonVariant="outline"
              onButtonClick={() => setSheetOpen(true)}
              color="bg-gradient-to-r from-blue-800 to-blue-950"
            />
            
            <div className="mt-6">
              <DashboardHeader firstName={firstName} />
              
              <CardGrid 
                cards={actionCards}
                onCardsChange={setActionCards}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onAddNewCard={handleAddNewCard}
                specialCardsData={specialCardsData}
                // Add the missing props
                quickDemandTitle={newDemandTitle}
                onQuickDemandTitleChange={setNewDemandTitle}
                onQuickDemandSubmit={handleQuickDemandSubmit}
                onSearchSubmit={handleSearchSubmit}
                usuarioId={user?.id || ''}
                isMobileView={isMobile}
              />
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation - only visible on mobile */}
      {isMobile && <MobileBottomNav />}
      
      {/* Card Selection Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Adicionar Novo Card</SheetTitle>
            <SheetDescription>
              Escolha o tipo de card que deseja adicionar ao seu dashboard.
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card options */}
            <CardOption 
              title="Demandas Pendentes" 
              description="Visualize suas demandas aguardando resposta"
              onClick={() => {
                handleAddNewCard();
                setSheetOpen(false);
              }}
            />
            <CardOption 
              title="Notas Oficiais" 
              description="Gerencie notas oficiais e aprovações"
              onClick={() => {
                handleAddNewCard();
                setSheetOpen(false);
              }}
            />
            <CardOption 
              title="Card Personalizado" 
              description="Crie um card totalmente personalizado"
              onClick={() => {
                handleAddNewCard();
                setSheetOpen(false);
              }}
              isPrimary
            />
            <CardOption 
              title="Relatórios" 
              description="Acesse relatórios e estatísticas"
              onClick={() => {
                handleAddNewCard();
                setSheetOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Card Customization Modal */}
      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCardAdapter}
        initialData={editingCard || undefined}
      />
    </div>
  );
};

// Helper component for the sheet card options
const CardOption = ({ 
  title, 
  description, 
  onClick, 
  isPrimary = false 
}: { 
  title: string, 
  description: string, 
  onClick: () => void, 
  isPrimary?: boolean 
}) => (
  <button
    onClick={onClick}
    className={`p-4 text-left rounded-lg border ${
      isPrimary 
        ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
        : 'bg-white border-gray-200 hover:bg-gray-50'
    } transition-colors duration-200`}
  >
    <h3 className={`font-medium ${isPrimary ? 'text-blue-600' : 'text-gray-800'}`}>
      {title}
    </h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </button>
);

export default Dashboard;
