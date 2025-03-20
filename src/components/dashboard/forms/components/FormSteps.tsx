
import React from 'react';

export interface FormStep {
  title: string;
  description: string;
}

interface FormStepsProps {
  steps: FormStep[];
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const FormSteps: React.FC<FormStepsProps> = ({ steps, activeStep, onStepClick }) => {
  return (
    <div className="relative">
      <div className="overflow-hidden h-2 mb-4 flex rounded-lg bg-gray-200">
        <div 
          className="bg-[#003570] transition-all" 
          style={{
            width: `${activeStep / (steps.length - 1) * 100}%`
          }} 
        />
      </div>
      <div className="flex justify-between">
        {steps.map((_, index) => (
          <button 
            key={index} 
            className={`flex items-center justify-center rounded-full transition-colors cursor-pointer
              ${index === activeStep ? 'bg-orange-500 text-white' : 
                index < activeStep ? 'bg-[#003570] text-white' : 'bg-gray-200 text-gray-400 hover:bg-orange-200'}
              h-6 w-6 text-xs`}
            onClick={() => onStepClick && onStepClick(index)}
            aria-label={`Ir para etapa ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormSteps;
