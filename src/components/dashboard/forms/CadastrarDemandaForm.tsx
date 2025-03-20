
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import FormHeader from './components/FormHeader';
import FormSteps from './components/FormSteps';
import FormActions from './components/FormActions';
import FormContent, { FORM_STEPS } from './components/FormContent';
import { useDemandForm } from '@/hooks/demandForm';
import { ValidationError, validateDemandForm } from '@/lib/formValidationUtils';
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
    handleSubmit: submitForm,
    nextStep,
    prevStep,
    setSelectedDistrito
  } = useDemandForm(user?.id, onClose);

  console.log('Current user ID:', user?.id);

  const handleStepClick = (stepIndex: number) => {
    // Check if we're trying to go past the current step
    if (stepIndex > activeStep) {
      // Validate current step before allowing to proceed
      const errors = validateDemandForm(formData, activeStep);
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios antes de avançar.",
          variant: "destructive"
        });
        return;
      }
    }
    // Allow going to any previous step without validation
    if (stepIndex <= activeStep) {
      // Set active step to the clicked step
      for (let i = activeStep; i > stepIndex; i--) {
        prevStep();
      }
    } else {
      // If we're moving forward, go one step at a time with validation
      nextStep();
    }
  };

  const handleNextStep = () => {
    const errors = validateDemandForm(formData, activeStep);
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de avançar.",
        variant: "destructive"
      });
      return;
    }
    setValidationErrors([]);
    nextStep();
  };

  const handleSubmit = () => {
    const errors = validateDemandForm(formData, 5); // Validate all fields on submit
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Campos obrigatórios não preenchidos",
        description: "Preencha todos os campos obrigatórios antes de finalizar.",
        variant: "destructive"
      });
      return;
    }
    submitForm();
  };

  return (
    <div className="animate-fade-in">
      <FormHeader 
        title="Cadastrar Nova Solicitação" 
        onClose={onClose} 
        showTitleAndClose={false}
      />
      
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
          
          {validationErrors.length > 0 && (
            <Alert variant="destructive" className="mb-4 bg-orange-50 border-orange-200 text-orange-800">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <AlertTitle>Campos obrigatórios não preenchidos</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <FormContent
            activeStep={activeStep}
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleServiceSelect={handleServiceSelect}
            handlePerguntaChange={handlePerguntaChange}
            areasCoord={areasCoord}
            filteredServicesBySearch={filteredServicesBySearch}
            serviceSearch={serviceSearch}
            servicos={servicos}
            origens={origens}
            tiposMidia={tiposMidia}
            selectedDistrito={selectedDistrito}
            setSelectedDistrito={setSelectedDistrito}
            distritos={distritos}
            filteredBairros={filteredBairros}
            errors={validationErrors}
          />
          
          <FormActions 
            onPrevStep={prevStep}
            onNextStep={handleNextStep}
            isLastStep={activeStep === FORM_STEPS.length - 1}
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
