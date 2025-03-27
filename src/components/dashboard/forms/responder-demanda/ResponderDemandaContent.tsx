
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { useDemandasData } from './hooks/useDemandasData';
import { useRespostaForm } from './hooks/useRespostaForm';
import { ViewMode } from './types';

import DemandasFilter from './components/DemandasFilter';
import DemandaList from './components/DemandaList';
import DemandaGrid from './components/DemandaGrid';
import RespostaForm from './components/RespostaForm';

const ResponderDemandaContent: React.FC = () => {
  const navigate = useNavigate();
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
    handleSelectDemanda,
  } = useDemandasData();

  const {
    resposta,
    setResposta,
    comentarios,
    setComentarios,
    isLoading,
    handleSubmitResposta,
  } = useRespostaForm(
    selectedDemanda,
    setSelectedDemanda,
    demandas,
    setDemandas,
    filteredDemandas,
    setFilteredDemandas
  );

  const handleNavigateToConsultar = () => {
    navigate('/dashboard/comunicacao/consultar-demandas');
  };

  return (
    <div className="animate-fade-in">
      <Card className="border border-gray-200 mb-4 shadow-sm rounded-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-subpi-blue">Responder Demandas</h1>
          <Button
            variant="outline"
            onClick={handleNavigateToConsultar}
            className="text-sm rounded-md"
          >
            Consultar Outras Demandas
          </Button>
        </div>

        <CardContent className="p-6 space-y-6">
          {!selectedDemanda && (
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
          )}

          {selectedDemanda ? (
            <RespostaForm
              selectedDemanda={selectedDemanda}
              resposta={resposta}
              setResposta={setResposta}
              comentarios={comentarios}
              setComentarios={setComentarios}
              onBack={() => setSelectedDemanda(null)}
              isLoading={isLoading}
              onSubmit={handleSubmitResposta}
            />
          ) : viewMode === 'cards' ? (
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
    </div>
  );
};

export default ResponderDemandaContent;
