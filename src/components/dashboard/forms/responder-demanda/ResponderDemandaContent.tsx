
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
  
  return (
    <div className="animate-fade-in">
      {selectedDemanda ? (
        <Card className="border border-gray-200 shadow-sm rounded-lg">
          <CardContent className="p-6 space-y-6">
            <RespostaForm 
              selectedDemanda={selectedDemanda} 
              resposta={resposta} 
              setResposta={setResposta} 
              comentarios={comentarios} 
              setComentarios={setComentarios} 
              onBack={() => setSelectedDemanda(null)} 
              isLoading={isLoading} 
              onSubmit={handleSubmitResposta}
              handleRespostaChange={handleRespostaChange}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Área de filtros separada visualmente */}
          <div className="mt-4 mb-6">
            <DemandasFilter 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              areaFilter={areaFilter} 
              setAreaFilter={setAreaFilter} 
              prioridadeFilter={prioridadeFilter} 
              setPrioridadeFilter={setPrioridadeFilter} 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
              areas={areas} 
            />
          </div>

          {/* Lista ou grid de demandas */}
          <Card className="border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-6">
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
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ResponderDemandaContent;
