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
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={isFirstStep}
      >
        Voltar
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          variant="default"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Finalizar"}
        </Button>
      ) : (
        <Button
          type="button"
          variant="default"
          onClick={onNextStep}
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
