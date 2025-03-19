
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FormActionsProps {
  onPrevStep: () => void;
  onNextStep: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  onPrevStep,
  onNextStep,
  isLastStep,
  isFirstStep,
  isSubmitting,
  onSubmit
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={onPrevStep} 
        disabled={isFirstStep} 
        className="rounded-lg"
      >
        Voltar
      </Button>
      
      {isLastStep ? (
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting} 
          className="bg-[#003570] hover:bg-[#002855] rounded-lg"
        >
          {isSubmitting ? "Enviando..." : "Finalizar"}
        </Button>
      ) : (
        <Button 
          onClick={onNextStep} 
          className="bg-[#003570] hover:bg-[#002855] rounded-lg"
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FormActions;
