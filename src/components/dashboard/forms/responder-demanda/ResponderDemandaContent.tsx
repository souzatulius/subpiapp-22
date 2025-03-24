
import React, { useState } from 'react';
import { useDemandasData } from './hooks/useDemandasData';
import { useRespostaForm } from './hooks/useRespostaForm';
import { Demanda, ViewMode } from './types';
import DemandasFilter from './components/DemandasFilter';
import DemandaList from './components/DemandaList';
import DemandaGrid from './components/DemandaGrid';
import EmptyState from './components/EmptyState';
import RespostaForm from './components/RespostaForm';
import { Loader2 } from 'lucide-react';

const ResponderDemandaContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    counts,
    filteredDemandas,
    selectedDemanda,
    setSelectedDemanda,
    isLoading,
    demandas,
    setDemandas,
    setFilteredDemandas,
    areaFilter,
    setAreaFilter,
    prioridadeFilter,
    setPrioridadeFilter,
    areas,
    isLoadingDemandas,
    handleSelectDemanda
  } = useDemandasData();

  const {
    resposta,
    setResposta,
    respostasPerguntas,
    handleRespostaPerguntaChange,
    isLoading: isLoadingForm,
    handleSubmitResposta
  } = useRespostaForm(
    selectedDemanda,
    setSelectedDemanda,
    demandas,
    setDemandas,
    filteredDemandas,
    setFilteredDemandas
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg text-gray-600">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedDemanda ? (
        <RespostaForm
          selectedDemanda={selectedDemanda}
          resposta={resposta}
          setResposta={setResposta}
          respostasPerguntas={respostasPerguntas}
          handleRespostaPerguntaChange={handleRespostaPerguntaChange}
          onBack={() => setSelectedDemanda(null)}
          isLoading={isLoadingForm}
          onSubmit={handleSubmitResposta}
        />
      ) : (
        <>
          <DemandasFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
            counts={counts}
            areaFilter={areaFilter}
            setAreaFilter={setAreaFilter}
            prioridadeFilter={prioridadeFilter}
            setPrioridadeFilter={setPrioridadeFilter}
            areas={areas}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isLoadingDemandas={isLoadingDemandas}
          />
          
          {filteredDemandas.length === 0 ? (
            <EmptyState searchTerm={searchTerm} />
          ) : (
            <>
              {viewMode === 'list' && (
                <DemandaList
                  demandas={filteredDemandas}
                  onSelectDemanda={handleSelectDemanda}
                />
              )}
              {viewMode === 'grid' && (
                <DemandaGrid
                  demandas={filteredDemandas}
                  onSelectDemanda={handleSelectDemanda}
                />
              )}
              {viewMode === 'cards' && (
                <DemandaGrid
                  demandas={filteredDemandas}
                  onSelectDemanda={handleSelectDemanda}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ResponderDemandaContent;
