
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDemandasData } from '@/hooks/dashboard/forms/criar-nota/useDemandasData';
import { useNotaForm } from '@/components/dashboard/forms/criar-nota/useNotaForm';
import DemandaSelection from './criar-nota/DemandaSelection';
import DemandaInfo from './criar-nota/DemandaInfo';
import NotaForm from './criar-nota/NotaForm';
import { CriarNotaFormProps } from '@/types/demand';

const CriarNotaForm: React.FC<CriarNotaFormProps> = ({
  onClose
}) => {
  const {
    filteredDemandas,
    searchTerm,
    setSearchTerm,
    isLoading
  } = useDemandasData();
  
  const {
    selectedDemanda,
    titulo,
    setTitulo,
    texto,
    setTexto,
    isSubmitting,
    step,
    formattedResponses,
    handleDemandaSelect,
    handleSubmit
  } = useNotaForm(onClose);
  
  return (
    <div className="animate-fade-in space-y-6">
      {step === 'select-demand' ? (
        <DemandaSelection 
          filteredDemandas={filteredDemandas} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onDemandaSelect={(demandaId) => handleDemandaSelect(demandaId, filteredDemandas)} 
          isLoading={isLoading} 
        />
      ) : (
        <>
          {selectedDemanda && (
            <DemandaInfo 
              selectedDemanda={selectedDemanda} 
              formattedResponses={formattedResponses} 
            />
          )}
          
          <NotaForm 
            titulo={titulo} 
            setTitulo={setTitulo} 
            texto={texto} 
            setTexto={setTexto} 
            handleSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            selectedDemanda={selectedDemanda}
            formattedResponses={formattedResponses} 
          />
        </>
      )}
    </div>
  );
};

export default CriarNotaForm;
