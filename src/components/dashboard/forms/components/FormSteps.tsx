import React from 'react';
export interface FormStep {
  title: string;
  description: string;
}
interface FormStepsProps {
  steps: FormStep[];
  activeStep: number;
}
const FormSteps: React.FC<FormStepsProps> = ({
  steps,
  activeStep
}) => {
  return <div className="relative">
      <div className="overflow-hidden h-2 mb-4 flex bg-orange-600 rounded-2xl">
        <div className="bg-[#003570] transition-all" style={{
        width: `${activeStep / (steps.length - 1) * 100}%`
      }} />
      </div>
      <div className="flex justify-between">
        {steps.map((_, index) => <div key={index} className={`flex items-center justify-center rounded-full transition-colors 
              ${index <= activeStep ? 'bg-[#003570] text-white' : 'bg-gray-200 text-gray-400'}
              h-6 w-6 text-xs`}>
            {index + 1}
          </div>)}
      </div>
    </div>;
};
export default FormSteps;