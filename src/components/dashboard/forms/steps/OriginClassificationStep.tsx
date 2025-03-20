
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Book, Newspaper, Monitor, MousePointer, Globe, HelpCircle } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';

interface OriginClassificationStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  origens: any[];
  tiposMidia: any[];
  errors?: ValidationError[];
}

const OriginClassificationStep: React.FC<OriginClassificationStepProps> = ({
  formData,
  handleSelectChange,
  origens,
  tiposMidia,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Get media type icon based on description
  const getMediaTypeIcon = (descricao: string) => {
    const iconMap: {
      [key: string]: React.ReactNode;
    } = {
      "Revista": <Book className="h-6 w-6" />,
      "Impresso": <Newspaper className="h-6 w-6" />,
      "Jornal Online": <Monitor className="h-6 w-6" />,
      "Portal": <MousePointer className="h-6 w-6" />,
      "Blog": <Globe className="h-6 w-6" />,
      "Outros": <HelpCircle className="h-6 w-6" />
    };
    return iconMap[descricao] || <HelpCircle className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="origem_id" 
          className={`block mb-2 ${hasError('origem_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Origem da Demanda {hasError('origem_id') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {origens.map(origem => (
            <Button 
              key={origem.id} 
              type="button" 
              variant={formData.origem_id === origem.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
                formData.origem_id === origem.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('origem_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleSelectChange('origem_id', origem.id)}
            >
              <span className="text-sm font-semibold">{origem.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('origem_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('origem_id')}</p>
        )}
      </div>
      
      <div>
        <Label 
          htmlFor="tipo_midia_id" 
          className={`block mb-2 ${hasError('tipo_midia_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Tipo de Mídia {hasError('tipo_midia_id') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tiposMidia.map(tipo => (
            <Button 
              key={tipo.id} 
              type="button" 
              variant={formData.tipo_midia_id === tipo.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
                formData.tipo_midia_id === tipo.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('tipo_midia_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleSelectChange('tipo_midia_id', tipo.id)}
            >
              {getMediaTypeIcon(tipo.descricao)}
              <span className="text-sm font-semibold">{tipo.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('tipo_midia_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('tipo_midia_id')}</p>
        )}
      </div>
    </div>
  );
};

export default OriginClassificationStep;
