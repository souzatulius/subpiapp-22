
import React from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useSupabaseAuth';
import FormHeader from './components/FormHeader';
import FormSteps, { FormStep } from './components/FormSteps';
import FormActions from './components/FormActions';
import IdentificationStep from './steps/IdentificationStep';
import OriginClassificationStep from './steps/OriginClassificationStep';
import PriorityDeadlineStep from './steps/PriorityDeadlineStep';
import RequesterInfoStep from './steps/RequesterInfoStep';
import LocationStep from './steps/LocationStep';
import QuestionsDetailsStep from './steps/QuestionsDetailsStep';
import { useDemandForm } from '@/hooks/useDemandForm';

interface CadastrarDemandaFormProps {
  onClose: () => void;
}

const CadastrarDemandaForm: React.FC<CadastrarDemandaFormProps> = ({
  onClose
}) => {
  const { user } = useAuth();
  
  const {
    formData,
    areasCoord,
    servicos,
    origens,
    tiposMidia,
    distritos,
    isLoading,
    serviceSearch,
    filteredServicesBySearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handleServiceSelect,
    handlePerguntaChange,
    handleSubmit,
    nextStep,
    prevStep,
    setSelectedDistrito
  } = useDemandForm(user?.id, onClose);

  const steps: FormStep[] = [
    {
      title: "Identificação da Demanda",
      description: "Informe os detalhes básicos da solicitação"
    }, 
    {
      title: "Origem e Classificação",
      description: "Selecione a origem e tipo de mídia"
    }, 
    {
      title: "Prioridade e Prazo",
      description: "Defina a prioridade e prazo para resposta"
    }, 
    {
      title: "Dados do Solicitante",
      description: "Informe os dados de contato (opcional)"
    }, 
    {
      title: "Localização",
      description: "Informe o endereço e bairro relacionado"
    }, 
    {
      title: "Perguntas e Detalhes",
      description: "Adicione perguntas e detalhes adicionais"
    }
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <IdentificationStep 
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleServiceSelect={handleServiceSelect}
            areasCoord={areasCoord}
            filteredServicesBySearch={filteredServicesBySearch}
            serviceSearch={serviceSearch}
            servicos={servicos}
          />
        );
      case 1:
        return (
          <OriginClassificationStep 
            formData={formData}
            handleSelectChange={handleSelectChange}
            origens={origens}
            tiposMidia={tiposMidia}
          />
        );
      case 2:
        return (
          <PriorityDeadlineStep 
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />
        );
      case 3:
        return (
          <RequesterInfoStep 
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 4:
        return (
          <LocationStep 
            formData={formData}
            selectedDistrito={selectedDistrito}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            setSelectedDistrito={setSelectedDistrito}
            distritos={distritos}
            filteredBairros={filteredBairros}
          />
        );
      case 5:
        return (
          <QuestionsDetailsStep 
            formData={formData}
            handleChange={handleChange}
            handlePerguntaChange={handlePerguntaChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <FormHeader 
        title="Cadastrar Nova Solicitação" 
        onClose={onClose} 
      />
      
      <Card className="border border-gray-200 rounded-lg">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">
              {steps[activeStep].title}
            </h3>
            <p className="text-sm text-gray-500">
              {steps[activeStep].description}
            </p>
          </div>
          
          <div className="mb-6">
            <FormSteps steps={steps} activeStep={activeStep} />
          </div>
          
          {renderStepContent()}
          
          <FormActions 
            onPrevStep={prevStep}
            onNextStep={nextStep}
            isLastStep={activeStep === steps.length - 1}
            isFirstStep={activeStep === 0}
            isSubmitting={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
};

export default CadastrarDemandaForm;
