
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './ValidationUtils';

interface TemaSelectorProps {
  problemas: any[];
  selectedProblemId: string;
  onChange: (problemId: any) => void;
  errors: ValidationError[];
}

const TemaSelector: React.FC<TemaSelectorProps> = ({ 
  problemas, 
  selectedProblemId, 
  onChange,
  errors 
}) => {
  // Handle click to allow deselection
  const handleProblemClick = (problemId: string) => {
    if (selectedProblemId === problemId) {
      onChange(''); // Deselect if clicking the same problem
    } else {
      onChange(problemId);
    }
  };

  return (
    <div className="space-y-3">
      <Label 
        htmlFor="problema_id" 
        className={`block text-base font-medium ${hasFieldError('problema_id', errors) ? 'text-orange-500' : ''}`}
      >
        Sobre qual assunto é a demanda? {hasFieldError('problema_id', errors) && <span className="text-orange-500">*</span>}
      </Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {problemas.map(problema => (
          <div key={problema.id} className="w-full">
            <Button
              type="button"
              variant={selectedProblemId === problema.id ? "default" : "outline"}
              className={`w-full h-auto py-3 flex flex-col items-center justify-center gap-2 rounded-xl
                ${selectedProblemId === problema.id ? "ring-2 ring-[#003570]" : ""}
                ${hasFieldError('problema_id', errors) ? 'border-orange-500' : ''}
              `}
              onClick={() => handleProblemClick(problema.id)}
            >
              <span className="text-sm font-semibold whitespace-normal text-center">
                {problema.descricao}
              </span>
            </Button>
          </div>
        ))}
      </div>
      
      {hasFieldError('problema_id', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('problema_id', errors)}</p>
      )}
    </div>
  );
};

export default TemaSelector;
