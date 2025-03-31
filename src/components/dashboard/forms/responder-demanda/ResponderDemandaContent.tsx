
import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDemandasData } from './hooks/useDemandasData';
import { useRespostaForm } from './hooks/useRespostaForm';
import { ViewMode } from './types';
import DemandasFilter from './components/DemandasFilter';
import DemandaList from './components/DemandaList';
import DemandaGrid from './components/DemandaGrid';
import RespostaForm from './components/RespostaForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
    handleRespostaChange: originalHandleRespostaChange
  } = useRespostaForm(selectedDemanda, setSelectedDemanda, demandas, setDemandas, filteredDemandas, setFilteredDemandas);

  // Create a wrapper for handleRespostaChange to adapt it to the expected format
  const handleRespostaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    originalHandleRespostaChange('resposta', e.target.value);
  };

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
      <Card className="border border-gray-200 shadow-sm border-transparent bg-transparent rounded-none">
        <CardContent className="p-6 px-0 border border-transparent border-0 bg-transparent py-0">
          {selectedDemanda ? (
            <RespostaForm 
              selectedDemanda={selectedDemanda} 
              resposta={resposta['resposta'] || ''} 
              setResposta={(value) => setResposta({...resposta, resposta: value})} 
              comentarios={comentarios} 
              setComentarios={setComentarios} 
              onBack={handleBack} 
              isLoading={isLoading} 
              onSubmit={handleSubmitResposta}
              handleRespostaChange={handleRespostaChange}
              hideBackButton={true} // Hide the back button in the form as we now have it in the filter bar
            />
          ) : (
            <>
              {viewMode === 'cards' ? (
                <DemandaGrid 
                  demandas={filteredDemandas} 
                  selectedDemanda={selectedDemanda} 
                  handleSelectDemanda={handleSelectDemanda} 
                  isLoading={isLoadingDemandas} 
                />
              ) : (
                <DemandaList 
                  demandas={filteredDemandas} 
                  selectedDemanda={selectedDemanda} 
                  handleSelectDemanda={handleSelectDemanda} 
                  isLoading={isLoadingDemandas} 
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponderDemandaContent;
