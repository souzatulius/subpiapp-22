
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    formData,
    problemas,
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
    selectedFile,
    handleChange,
    handleSelectChange,
    handleServiceSelect,
    handlePerguntaChange,
    handleFileChange,
    handleSubmit: submitForm,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep
  } = useDemandForm(user?.id, onClose);

  const handleStepClick = (stepIndex: number) => {
    // Allow free navigation between steps
    setActiveStep(stepIndex);
  };

  const handleNextStep = () => {
    // Validate current step but allow navigation even with errors
    const errors = validateDemandForm(formData, activeStep);
    setValidationErrors(errors);
    
    // Always allow moving to next step
    nextStep();
  };

  const handleSubmit = async () => {
    // Validate all steps before final submission
    setIsSubmitting(true);
    let allErrors: ValidationError[] = [];
    
    // Validate each step
    for (let i = 0; i < FORM_STEPS.length; i++) {
      const stepErrors = validateDemandForm(formData, i);
      allErrors = [...allErrors, ...stepErrors];
    }
    
    setValidationErrors(allErrors);
    
    if (allErrors.length === 0) {
      try {
        await submitForm();
      } catch (error: any) {
        console.error('Submission error:', error);
        toast.error("Erro ao cadastrar demanda", {
          description: error.message || "Ocorreu um erro ao processar sua solicitação."
        });
      }
    } else {
      toast.error("Formulário incompleto", {
        description: "Por favor, preencha todos os campos obrigatórios."
      });
    }
    setIsSubmitting(false);
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
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
            problemas={problemas}
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
            isSubmitting={isLoading || isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
};

export default CadastrarDemandaForm;
