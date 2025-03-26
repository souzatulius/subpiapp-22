
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Book, Newspaper, Monitor, MousePointer, Globe, HelpCircle, Mic, Tv, Radio, Flag } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';

interface OriginClassificationStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    veiculo_imprensa: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  origens: any[];
  tiposMidia: any[];
  errors?: ValidationError[];
}

const OriginClassificationStep: React.FC<OriginClassificationStepProps> = ({
  formData,
  handleSelectChange,
  handleChange,
  origens,
  tiposMidia,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };
  
  // Verifica se a origem está entre as que devem mostrar tipo de mídia
  const selectedOrigin = origens.find(origem => origem.id === formData.origem_id);
  const showMediaFields = selectedOrigin?.descricao === "Imprensa" || 
                         selectedOrigin?.descricao === "SMSUB" ||
                         selectedOrigin?.descricao === "SECOM";
                         
  const showVeiculoImprensa = showMediaFields && formData.tipo_midia_id;
  
  // Resetar tipo_midia_id quando a origem não exige este campo
  useEffect(() => {
    if (!showMediaFields && formData.tipo_midia_id) {
      handleSelectChange('tipo_midia_id', '');
    }
  }, [showMediaFields, formData.tipo_midia_id]);

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
      "Podcast": <Mic className="h-6 w-6" />,
      "TV": <Tv className="h-6 w-6" />,
      "Rádio": <Radio className="h-6 w-6" />,
      "Outros": <HelpCircle className="h-6 w-6" />
    };
    return iconMap[descricao] || <HelpCircle className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <label 
          htmlFor="origem_id" 
          className={`block mb-2 ${hasError('origem_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Origem da Demanda {hasError('origem_id') && <span className="text-orange-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
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
      
      {showMediaFields && (
        <div className="animate-fadeIn">
          <label 
            htmlFor="tipo_midia_id" 
            className={`block mb-2 ${hasError('tipo_midia_id') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Tipo de Mídia {hasError('tipo_midia_id') && <span className="text-orange-500">*</span>}
          </label>
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
      )}
      
      {showVeiculoImprensa && (
        <div className="animate-fadeIn">
          <label 
            htmlFor="veiculo_imprensa" 
            className={`block mb-2 ${hasError('veiculo_imprensa') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Veículo de Imprensa
          </label>
          <Input 
            id="veiculo_imprensa" 
            name="veiculo_imprensa" 
            value={formData.veiculo_imprensa} 
            onChange={handleChange} 
            className={hasError('veiculo_imprensa') ? 'border-orange-500' : ''}
          />
          {hasError('veiculo_imprensa') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('veiculo_imprensa')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OriginClassificationStep;
