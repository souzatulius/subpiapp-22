
import React, { useState } from 'react';
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
    // Permitir navegação direta para qualquer etapa
    setActiveStep(stepIndex);
  };

  const handleNextStep = () => {
    // Só validar na última etapa
    if (activeStep === 5) {
      const errors = validateDemandForm(formData, activeStep);
      setValidationErrors(errors);
      
      if (errors.length === 0) {
        // Se não tiver erros, prossegue com o envio
        handleSubmit();
      } else {
        console.log('Validation errors:', errors);
        toast({
          title: "Formulário incompleto",
          description: getErrorSummary(errors),
          variant: "destructive"
        });
      }
    } else {
      // Para outras etapas, apenas avança sem validar
      nextStep();
    }
  };

  const handleSubmit = async () => {
    try {
      await submitForm();
    } catch (error: any) {
      console.error('Submission error:', error);
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
          
          {/* Apenas mostrar erro geral na etapa de revisão (etapa 6) */}
          {validationErrors.length > 0 && activeStep === 5 && (
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
