
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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
    handleSelectDemanda
  } = useDemandasData();

  const {
    resposta,
    setResposta,
    respostasPerguntas,
    handleRespostaPerguntaChange,
    isLoading,
    handleSubmitResposta
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
      <Card className="border border-gray-200 mb-4">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-xl font-semibold text-[#003570] flex justify-between items-center">
            <span>Responder Demandas</span>
            <Button 
              variant="outline" 
              onClick={handleNavigateToConsultar}
              className="text-sm"
            >
              Consultar Outras Demandas
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
              respostasPerguntas={respostasPerguntas}
              handleRespostaPerguntaChange={handleRespostaPerguntaChange}
              onBack={() => setSelectedDemanda(null)}
              isLoading={isLoading}
              onSubmit={handleSubmitResposta}
            />
          ) : (
            viewMode === 'cards' ? (
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
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponderDemandaContent;
