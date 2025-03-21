
import React from 'react';
import { Check } from 'lucide-react';

export interface FormStep {
  title: string;
  description: string;
}

interface FormStepsProps {
  steps: FormStep[];
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const FormSteps: React.FC<FormStepsProps> = ({
  steps,
  activeStep,
  onStepClick
}) => {
  // Get the class for step circle
  const getStepCircleClass = (index: number) => {
    if (index < activeStep) {
      // Completed step
      return 'bg-[#003570] text-white';
    } else if (index === activeStep) {
      // Active step
      return 'bg-orange-500 text-white'; 
    } else {
      // Future step
      return 'bg-gray-200 text-gray-600 hover:bg-orange-100';
    }
  };

  // Get the class for step line
  const getStepLineClass = (index: number) => {
    if (index < activeStep) {
      return 'border-[#003570]';
    } else {
      return 'border-gray-300';
    }
  };

  const handleStepClick = (index: number) => {
    if (onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div 
              className={`z-10 w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors cursor-pointer ${getStepCircleClass(index)}`}
              onClick={() => handleStepClick(index)}
              title={step.title}
            >
              {index < activeStep ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            
            {/* Line connecting steps - not applicable for the last item */}
            {index < steps.length - 1 && (
              <div className={`flex-1 border-t-2 ${getStepLineClass(index)}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FormSteps;
