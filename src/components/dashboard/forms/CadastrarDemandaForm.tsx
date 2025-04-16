
import React, { useState, useEffect, useRef } from 'react';
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
import { useLocation } from 'react-router-dom';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

interface CadastrarDemandaFormProps {
  onClose: () => void;
}

const CadastrarDemandaForm: React.FC<CadastrarDemandaFormProps> = ({
  onClose
}) => {
  const { user } = useAuth();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false); 
  const location = useLocation();
  const formRef = useRef<HTMLDivElement>(null);
  const { showFeedback } = useAnimatedFeedback();
  
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
    handleServiceSearch,
    generateAIContent
  } = useDemandForm(user?.id, onClose);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeStep]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const origemId = searchParams.get('origem_id');
    
    if (origemId && origens.some(origem => origem.id === origemId)) {
      handleSelectChange('origem_id', origemId);
    }
  }, [location.search, origens]);

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const generateAIContentWithToast = async () => {
    try {
      setIsGeneratingAI(true);
      await generateAIContent();
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Erro ao gerar conteúdo",
        description: "Não foi possível gerar o conteúdo sugerido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const validateFormBeforeSubmit = () => {
    const errors = validateDemandForm(formData, 4);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (FORM_STEPS && activeStep >= 0 && activeStep < FORM_STEPS.length) {
      if (activeStep === FORM_STEPS.length - 1) {
        if (validateFormBeforeSubmit()) {
          handleSubmit(formData);
        } else {
          setShowValidationAlert(true);
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
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (validateFormBeforeSubmit()) {
        showFeedback('loading', 'Cadastrando demanda...', { progress: 50 });
        
        await submitForm(formData);
        
        showFeedback('success', 'Demanda cadastrada com sucesso!', { 
          duration: 5000
        });
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
      
      showFeedback('error', errorMsg, { duration: 5000 });
    }
  };

  return (
    <div className="animate-fade-in" ref={formRef}>
      <Card className="border border-gray-200 rounded-2xl shadow-sm">
        <div className="p-4 lg:p-5">
          <div className="mb-4">
            {FORM_STEPS && activeStep >= 0 && activeStep < FORM_STEPS.length && (
              <h3 className="form-step-title text-xl font-semibold text-gray-800">
                {FORM_STEPS[activeStep].title}
              </h3>
            )}
            {FORM_STEPS && 
             activeStep >= 0 && 
             activeStep < FORM_STEPS.length && 
             FORM_STEPS[activeStep].description && (
              <p className="text-sm text-gray-500">
                {FORM_STEPS[activeStep].description}
              </p>
            )}
          </div>
          
          <div className="mb-5">
            <FormSteps 
              steps={FORM_STEPS} 
              activeStep={activeStep} 
              onStepClick={handleStepClick}
            />
          </div>
          
          {showValidationAlert && validationErrors.length > 0 && activeStep === FORM_STEPS.length - 1 && (
            <Alert variant="destructive" className="mb-4 bg-orange-50 border-orange-200 text-orange-800 rounded-xl">
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
            onNavigateToStep={setActiveStep}
            onGenerateAIContent={generateAIContentWithToast}
            isGenerating={isGeneratingAI}
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
