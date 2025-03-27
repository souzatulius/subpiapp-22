import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import FormHeader from './components/FormHeader';
import FormSteps from './components/FormSteps';
import FormActions from './components/FormActions';
import FormContent, { FORM_STEPS } from './components/FormContent';
import { useDemandForm } from '@/hooks/demandForm';
import { ValidationError, validateDemandForm, getErrorSummary } from '@/lib/formValidationUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface CadastrarDemandaFormProps {
  onClose: () => void;
}

const CadastrarDemandaForm: React.FC<CadastrarDemandaFormProps> = ({
  onClose
}) => {
  const { user } = useAuth();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const {
    formData,
    areasCoord,
    origens,
    tiposMidia,
    distritos,
    bairros,
    problemas,
    isLoading,
    serviceSearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handlePerguntaChange,
    handleAnexosChange,
    handleSubmit: submitForm,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep,
    servicos,
    filteredServicos,
    handleServiceSearch
  } = useDemandForm(user?.id, onClose);

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const validateFormBeforeSubmit = () => {
    const errors = validateDemandForm(formData, 4);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (activeStep === FORM_STEPS.length - 1) {
      if (validateFormBeforeSubmit()) {
        handleSubmit(formData);
      } else {
        const missingFieldsMessage = getErrorSummary(validationErrors);
        toast({
          title: "Formulário incompleto",
          description: missingFieldsMessage,
          variant: "destructive"
        });
      }
    } else {
      nextStep();
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (validateFormBeforeSubmit()) {
        await submitForm(formData);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      
      let errorMsg = "Ocorreu um erro ao processar sua solicitação.";
      
      if (error.message && error.message.includes("invalid input syntax")) {
        const missingFieldsMessage = getErrorSummary(validationErrors);
        errorMsg = `Campos obrigatórios não preenchidos: ${missingFieldsMessage}`;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast({
        title: "Erro ao cadastrar demanda",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="border border-gray-200 rounded-lg">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">
              {FORM_STEPS[activeStep].title}
            </h3>
            <p className="text-sm text-gray-500">
              {FORM_STEPS[activeStep].description}
            </p>
          </div>
          
          <div className="mb-6">
            <FormSteps 
              steps={FORM_STEPS} 
              activeStep={activeStep} 
              onStepClick={handleStepClick}
            />
          </div>
          
          {validationErrors.length > 0 && activeStep === FORM_STEPS.length - 1 && (
            <Alert variant="destructive" className="mb-4 bg-orange-50 border-orange-200 text-orange-800">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <AlertTitle>Campos obrigatórios não preenchidos</AlertTitle>
              <AlertDescription>
                {getErrorSummary(validationErrors)}
              </AlertDescription>
            </Alert>
          )}
          
          <FormContent
            activeStep={activeStep}
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handlePerguntaChange={handlePerguntaChange}
            handleAnexosChange={handleAnexosChange}
            areasCoord={areasCoord}
            problemas={problemas}
            serviceSearch={serviceSearch}
            origens={origens}
            tiposMidia={tiposMidia}
            selectedDistrito={selectedDistrito}
            setSelectedDistrito={setSelectedDistrito}
            distritos={distritos}
            filteredBairros={filteredBairros}
            errors={validationErrors}
            servicos={servicos}
            filteredServicos={filteredServicos}
            handleServiceSearch={handleServiceSearch}
            nextStep={nextStep}
          />
          
          <FormActions 
            onPrevStep={prevStep}
            onNextStep={handleNextStep}
            isLastStep={activeStep === FORM_STEPS.length - 1}
            isFirstStep={activeStep === 0}
            isSubmitting={isLoading}
            onSubmit={() => handleSubmit(formData)}
          />
        </div>
      </Card>
    </div>
  );
};

export default CadastrarDemandaForm;
