
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';

interface PriorityDeadlineStepProps {
  formData: {
    prioridade: string;
    prazo_resposta: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors?: ValidationError[];
}

const PriorityDeadlineStep: React.FC<PriorityDeadlineStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label 
          htmlFor="prioridade" 
          className={`block mb-2 ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prioridade {hasError('prioridade') && <span className="text-orange-500">*</span>}
        </Label>
        
        <div className="flex flex-col items-center mb-4">
          <div className="flex flex-col bg-gray-200 p-3 rounded-lg w-24 h-64 mb-2">
            {/* Traffic Light */}
            <button 
              onClick={() => handleSelectChange('prioridade', 'alta')}
              className={`w-16 h-16 rounded-full mx-auto mb-4 transition-all ${formData.prioridade === 'alta' ? 'ring-4 ring-gray-400' : ''}`}
              style={{ backgroundColor: '#FF4136' }}
              aria-label="Prioridade Alta"
            />
            <button 
              onClick={() => handleSelectChange('prioridade', 'media')}
              className={`w-16 h-16 rounded-full mx-auto mb-4 transition-all ${formData.prioridade === 'media' ? 'ring-4 ring-gray-400' : ''}`}
              style={{ backgroundColor: '#FFDC00' }}
              aria-label="Prioridade Média"
            />
            <button 
              onClick={() => handleSelectChange('prioridade', 'baixa')}
              className={`w-16 h-16 rounded-full mx-auto transition-all ${formData.prioridade === 'baixa' ? 'ring-4 ring-gray-400' : ''}`}
              style={{ backgroundColor: '#2ECC40' }}
              aria-label="Prioridade Baixa"
            />
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-600 mr-2" />
              <span className={`text-sm ${formData.prioridade === 'alta' ? 'font-bold' : ''}`}>Alta</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2" />
              <span className={`text-sm ${formData.prioridade === 'media' ? 'font-bold' : ''}`}>Média</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-600 mr-2" />
              <span className={`text-sm ${formData.prioridade === 'baixa' ? 'font-bold' : ''}`}>Baixa</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Label 
          htmlFor="prazo_resposta" 
          className={`block ${hasError('prazo_resposta') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prazo para Resposta {hasError('prazo_resposta') && <span className="text-orange-500">*</span>}
        </Label>
        <Input 
          id="prazo_resposta" 
          name="prazo_resposta" 
          type="datetime-local" 
          value={formData.prazo_resposta} 
          onChange={handleChange} 
          className={`rounded-lg ${hasError('prazo_resposta') ? 'border-orange-500 ring-orange-500' : ''}`} 
        />
        {hasError('prazo_resposta') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prazo_resposta')}</p>
        )}
      </div>
    </div>
  );
};

export default PriorityDeadlineStep;
