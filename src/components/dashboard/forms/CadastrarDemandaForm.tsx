
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
import { useNavigate } from 'react-router-dom';

interface CadastrarDemandaFormProps {
  onClose: () => void;
}

const CadastrarDemandaForm: React.FC<CadastrarDemandaFormProps> = ({
  onClose
}) => {
  const { user } = useAuth();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const navigate = useNavigate();
  
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
    setSelectedDistrito,
    resetForm
  } = useDemandForm(user?.id, onClose);

  console.log('Current user ID:', user?.id);

  const handleStepClick = (stepIndex: number) => {
    // Allow going to any step since no validation is required
    if (stepIndex <= activeStep) {
      // Set active step to the clicked step (going backward)
      for (let i = activeStep; i > stepIndex; i--) {
        prevStep();
      }
    } else {
      // Going forward
      for (let i = activeStep; i < stepIndex; i++) {
        nextStep();
      }
    }
  };

  const handleNextStep = () => {
    nextStep();
  };

  const handleSubmit = async () => {
    try {
      await submitForm();
      
      // Instead of closing, redirect to add a new demand
      toast({
        title: "Demanda cadastrada com sucesso!",
        description: "Iniciando cadastro de uma nova demanda."
      });
      
      // Reset the form for a new demand
      resetForm();
      
      // Go back to first step
      while (activeStep > 0) {
        prevStep();
      }
      
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar demanda",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
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
