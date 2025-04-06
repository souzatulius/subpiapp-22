
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
  onSubmit,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={isFirstStep}
        className="hover:bg-gray-100 hover:text-gray-800 rounded-2xl"
      >
        Voltar
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          variant="action"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 rounded-2xl"
        >
          {isSubmitting ? "Enviando..." : "Finalizar"}
        </Button>
      ) : (
        <Button
          type="button"
          variant="action"
          onClick={onNextStep}
          className="bg-orange-500 hover:bg-orange-600 rounded-2xl"
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FormActions;
