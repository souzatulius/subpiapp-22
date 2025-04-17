
import React, { useState } from 'react';
import { useDemandasData } from './hooks/useDemandasData';
import { useRespostaForm } from './hooks/useRespostaForm';
import RespostaForm from './components/RespostaForm';
import DemandaCard from './components/DemandaCard';
import UnifiedViewContainer from '@/components/shared/unified-view/UnifiedViewContainer';

const ResponderDemandaContent: React.FC = () => {
  // Change viewMode to match the UnifiedFilterBar's expected values
  const [viewMode, setViewMode] = useState<"list" | "cards">('list');
  
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
  
  // Convert areas to the expected format for the unified filter component
  const areaOptions = [
    { id: 'todos', label: 'Todas as coordenações' },
    ...areas.map(area => ({
      id: area.id,
      label: area.descricao
    }))
  ];
  
  const prioridadeOptions = [
    { id: 'todos', label: 'Todas as prioridades' },
    { id: 'alta', label: 'Alta' },
    { id: 'media', label: 'Média' },
    { id: 'baixa', label: 'Baixa' }
  ];

  // Render form if a demanda is selected
  if (selectedDemanda) {
    return (
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
        hideBackButton={false}
      />
    );
  }

  // Render the unified list/grid view - removendo a div container externa desnecessária
  return (
    <UnifiedViewContainer
      items={filteredDemandas}
      isLoading={isLoadingDemandas}
      renderListItem={(demanda) => (
        <DemandaCard
          demanda={demanda}
          isSelected={false}
          onClick={() => {}}
        />
      )}
      renderGridItem={(demanda) => (
        <DemandaCard
          demanda={demanda}
          isSelected={false}
          onClick={() => {}}
        />
      )}
      idExtractor={(demanda) => demanda.id}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onItemClick={handleSelectDemanda}
      selectedItemId={selectedDemanda?.id}
      filterOptions={{
        primaryFilter: {
          value: areaFilter,
          onChange: setAreaFilter,
          options: areaOptions,
          placeholder: 'Coordenação'
        },
        secondaryFilter: {
          value: prioridadeFilter,
          onChange: setPrioridadeFilter,
          options: prioridadeOptions,
          placeholder: 'Prioridade'
        }
      }}
      emptyStateMessage="Nenhuma demanda encontrada com os filtros selecionados"
      searchPlaceholder="Buscar demanda..."
      defaultViewMode={viewMode}
      className="animate-fade-in" // Mantendo a animação diretamente na classe do UnifiedViewContainer
    />
  );
};

export default ResponderDemandaContent;
