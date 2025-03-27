
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Book, Newspaper, Monitor, MousePointer, Globe, HelpCircle, Mic, Tv, Radio } from 'lucide-react';

interface RequesterInfoStepProps {
  formData: {
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
    tipo_midia_id: string;
    veiculo_imprensa: string;
    origem_id?: string; // Add the origen_id as optional property
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: ValidationError[];
  tiposMidia: any[];
  origens: any[];
}

const RequesterInfoStep: React.FC<RequesterInfoStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  errors,
  tiposMidia,
  origens
}) => {
  // Verifica se a origem está entre as que devem mostrar tipo de mídia
  const selectedOrigin = origens.find(origem => origem.id === formData.origem_id);
  const showMediaFields = selectedOrigin?.descricao === "Imprensa" || 
                         selectedOrigin?.descricao === "SMSUB" ||
                         selectedOrigin?.descricao === "SECOM";
                         
  const showVeiculoImprensa = showMediaFields && formData.tipo_midia_id;

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
    <div className="space-y-4">
      <div>
        <Label 
          htmlFor="nome_solicitante" 
          className={hasFieldError('nome_solicitante', errors) ? 'text-orange-500' : ''}
        >
          Nome do Solicitante
        </Label>
        <Input
          id="nome_solicitante"
          name="nome_solicitante"
          value={formData.nome_solicitante}
          onChange={handleChange}
          className={hasFieldError('nome_solicitante', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('nome_solicitante', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('nome_solicitante', errors)}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="telefone_solicitante" 
          className={hasFieldError('telefone_solicitante', errors) ? 'text-orange-500' : ''}
        >
          Telefone do Solicitante
        </Label>
        <Input
          id="telefone_solicitante"
          name="telefone_solicitante"
          value={formData.telefone_solicitante}
          onChange={handleChange}
          className={hasFieldError('telefone_solicitante', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('telefone_solicitante', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('telefone_solicitante', errors)}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="email_solicitante" 
          className={hasFieldError('email_solicitante', errors) ? 'text-orange-500' : ''}
        >
          Email do Solicitante
        </Label>
        <Input
          id="email_solicitante"
          name="email_solicitante"
          type="email"
          value={formData.email_solicitante}
          onChange={handleChange}
          className={hasFieldError('email_solicitante', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('email_solicitante', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('email_solicitante', errors)}</p>
        )}
      </div>
      
      {showMediaFields && (
        <div className="animate-fadeIn space-y-4">
          <div>
            <label 
              htmlFor="tipo_midia_id" 
              className={`block mb-2 ${hasFieldError('tipo_midia_id', errors) ? 'text-orange-500 font-semibold' : ''}`}
            >
              Tipo de Mídia {hasFieldError('tipo_midia_id', errors) && <span className="text-orange-500">*</span>}
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
                    hasFieldError('tipo_midia_id', errors) ? 'border-orange-500' : ''
                  }`} 
                  onClick={() => handleSelectChange('tipo_midia_id', tipo.id)}
                >
                  {getMediaTypeIcon(tipo.descricao)}
                  <span className="text-sm font-semibold">{tipo.descricao}</span>
                </Button>
              ))}
            </div>
            {hasFieldError('tipo_midia_id', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('tipo_midia_id', errors)}</p>
            )}
          </div>
          
          {showVeiculoImprensa && (
            <div className="animate-fadeIn">
              <label 
                htmlFor="veiculo_imprensa" 
                className={`block mb-2 ${hasFieldError('veiculo_imprensa', errors) ? 'text-orange-500 font-semibold' : ''}`}
              >
                Veículo de Imprensa
              </label>
              <Input 
                id="veiculo_imprensa" 
                name="veiculo_imprensa" 
                value={formData.veiculo_imprensa} 
                onChange={handleChange} 
                className={hasFieldError('veiculo_imprensa', errors) ? 'border-orange-500' : ''}
              />
              {hasFieldError('veiculo_imprensa', errors) && (
                <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('veiculo_imprensa', errors)}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequesterInfoStep;
