
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDemandasData } from './hooks/useDemandasData';
import { useRespostaForm } from './hooks/useRespostaForm';
import { ViewMode } from './types';
import DemandasFilter from './components/DemandasFilter';
import DemandaList from './components/DemandaList';
import DemandaGrid from './components/DemandaGrid';
import RespostaForm from './components/RespostaForm';

const ResponderDemandaContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const {
    demandas,
    setDemandas,
    filteredDemandas,
    setFilteredDemandas,
    selectedDemanda,
    setSelectedDemanda,
    isLoadingDemandas,
    areas,
    searchTerm,
    setSearchTerm,
    areaFilter,
    setAreaFilter,
    prioridadeFilter,
    setPrioridadeFilter,
    handleSelectDemanda
  } = useDemandasData();
  
  const {
    resposta,
    setResposta,
    comentarios,
    setComentarios,
    isLoading,
    handleSubmitResposta,
    handleRespostaChange
  } = useRespostaForm(
    selectedDemanda, 
    setSelectedDemanda, 
    demandas, 
    setDemandas, 
    filteredDemandas, 
    setFilteredDemandas
  );

  const handleBack = () => {
    setSelectedDemanda(null);
  };
  
  // Convert areas to the expected format
  const formattedAreas = areas.map(area => ({
    id: area.id,
    nome: area.descricao // Use the descricao field as nome
  }));
  
  return (
    <div className="animate-fade-in container mx-auto px-4">
      {/* Unified filter bar that's always visible */}
      <div className="mb-6">
        <DemandasFilter 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          areaFilter={areaFilter} 
          setAreaFilter={setAreaFilter} 
          prioridadeFilter={prioridadeFilter} 
          setPrioridadeFilter={setPrioridadeFilter} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          areas={formattedAreas}
          onBack={handleBack}
          showBackButton={!!selectedDemanda}
        />
      </div>

      {/* Content area - dynamically showing either list or details */}
      {selectedDemanda ? (
        <RespostaForm 
          selectedDemanda={selectedDemanda} 
          resposta={resposta} 
          setResposta={setResposta} 
          comentarios={comentarios} 
          setComentarios={setComentarios} 
          onBack={handleBack} 
          isLoading={isLoading} 
          onSubmit={handleSubmitResposta}
          handleRespostaChange={handleRespostaChange}
          hideBackButton={true} // Hide the back button in the form as we now have it in the filter bar
        />
      ) : (
        <Card className="border border-gray-200 shadow-sm rounded-lg">
          <CardContent className="p-6">
            {viewMode === 'cards' ? (
              <DemandaGrid 
                demandas={filteredDemandas} 
                selectedDemandaId={selectedDemanda ? selectedDemanda.id : null} 
                onSelectDemanda={handleSelectDemanda} 
                loading={isLoadingDemandas} 
              />
            ) : (
              <DemandaList 
                demandas={filteredDemandas} 
                selectedDemandaId={selectedDemanda ? selectedDemanda.id : null} 
                onSelectDemanda={handleSelectDemanda} 
                loading={isLoadingDemandas} 
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponderDemandaContent;
