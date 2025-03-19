
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, X } from 'lucide-react';
import { useDemandasData } from './criar-nota/useDemandasData';
import { useNotaForm } from './criar-nota/useNotaForm';
import DemandaSelection from './criar-nota/DemandaSelection';
import DemandaInfo from './criar-nota/DemandaInfo';
import NotaForm from './criar-nota/NotaForm';
import { CriarNotaFormProps } from './criar-nota/types';

const CriarNotaForm: React.FC<CriarNotaFormProps> = ({ onClose }) => {
  const { 
    filteredDemandas, 
    searchTerm, 
    setSearchTerm, 
    isLoading,
    demandas
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
    handleBackToSelection,
    handleSubmit
  } = useNotaForm(onClose);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="p-1.5"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <h2 className="text-xl font-semibold text-[#003570]">
          {step === 'select-demand' ? 'Selecionar Demanda' : 'Criar Nota Oficial'}
        </h2>
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="p-1.5"
        >
          <X className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
      
      {step === 'select-demand' ? (
        <DemandaSelection
          filteredDemandas={filteredDemandas}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDemandaSelect={(demandaId) => handleDemandaSelect(demandaId, demandas)}
          isLoading={isLoading}
        />
      ) : (
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-6">
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
                handleBackToSelection={handleBackToSelection}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                selectedDemanda={selectedDemanda}
                formattedResponses={formattedResponses}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CriarNotaForm;
