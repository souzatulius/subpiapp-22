
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';
import { AreaIcon } from './AreaIcon';

interface TemaSelectorProps {
  problemas: any[];
  selectedTemaId: string;
  handleSelectChange: (name: string, value: string) => void;
  errors?: ValidationError[];
}

const TemaSelector: React.FC<TemaSelectorProps> = ({
  problemas,
  selectedTemaId,
  handleSelectChange,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div>
      <Label className={`block mb-2 ${hasError('problema_id') ? 'text-orange-500 font-semibold' : ''}`}>
        Tema {hasError('problema_id') && <span className="text-orange-500">*</span>}
      </Label>
      <div className="flex flex-wrap gap-3">
        {problemas.map(tema => (
          <Button 
            key={tema.id} 
            type="button" 
            variant={selectedTemaId === tema.id ? "default" : "outline"} 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
              selectedTemaId === tema.id ? "ring-2 ring-[#003570]" : ""
            } ${
              hasError('problema_id') ? 'border-orange-500' : ''
            }`} 
            onClick={() => handleSelectChange('problema_id', tema.id)}
          >
            {tema.areas_coordenacao && <AreaIcon descricao={tema.areas_coordenacao.descricao} />}
            <span className="text-sm font-semibold">{tema.descricao}</span>
          </Button>
        ))}
      </div>
      {hasError('problema_id') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('problema_id')}</p>}
    </div>
  );
};

export default TemaSelector;
