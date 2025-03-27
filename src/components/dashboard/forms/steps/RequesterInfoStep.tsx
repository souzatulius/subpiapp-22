
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
    origem_id?: string;
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

  // Determinar se deve mostrar os campos de mídia
  const selectedOrigin = origens.find(origem => origem.id === formData.origem_id);
  const showMediaFields = selectedOrigin?.descricao === "Imprensa" || 
                        selectedOrigin?.descricao === "SMSUB" ||
                        selectedOrigin?.descricao === "SECOM";

  // Allow deselection of media type
  const handleMediaTypeClick = (mediaTypeId: string) => {
    if (formData.tipo_midia_id === mediaTypeId) {
      handleSelectChange('tipo_midia_id', ''); // Deselect if clicking the same media type
    } else {
      handleSelectChange('tipo_midia_id', mediaTypeId);
    }
  };

  return (
    <div className="space-y-6">
      {showMediaFields ? (
        <div className="animate-fadeIn space-y-4">
          <div>
            <label 
              htmlFor="tipo_midia_id" 
              className={`block mb-2 font-semibold ${hasFieldError('tipo_midia_id', errors) ? 'text-orange-500' : ''}`}
            >
              Tipo de Mídia {hasFieldError('tipo_midia_id', errors) && <span className="text-orange-500">*</span>}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tiposMidia.map(tipo => (
                <Button 
                  key={tipo.id} 
                  type="button" 
                  variant={formData.tipo_midia_id === tipo.id ? "default" : "outline"} 
                  className={`h-auto py-3 flex flex-col items-center justify-center gap-2 rounded-xl ${
                    formData.tipo_midia_id === tipo.id ? "ring-2 ring-[#003570]" : ""
                  } ${
                    hasFieldError('tipo_midia_id', errors) ? 'border-orange-500' : ''
                  }`} 
                  onClick={() => handleMediaTypeClick(tipo.id)}
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
          
          {formData.tipo_midia_id && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label 
                    htmlFor="nome_solicitante" 
                    className={`font-semibold ${hasFieldError('nome_solicitante', errors) ? 'text-orange-500' : ''}`}
                  >
                    Nome do Contato
                  </Label>
                  <Input
                    id="nome_solicitante"
                    name="nome_solicitante"
                    value={formData.nome_solicitante}
                    onChange={handleChange}
                    className={`mt-1 ${hasFieldError('nome_solicitante', errors) ? 'border-orange-500' : ''}`}
                  />
                  {hasFieldError('nome_solicitante', errors) && (
                    <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('nome_solicitante', errors)}</p>
                  )}
                </div>
                
                <div>
                  <Label 
                    htmlFor="veiculo_imprensa" 
                    className={`font-semibold ${hasFieldError('veiculo_imprensa', errors) ? 'text-orange-500' : ''}`}
                  >
                    Veículo de Imprensa
                  </Label>
                  <Input 
                    id="veiculo_imprensa" 
                    name="veiculo_imprensa" 
                    value={formData.veiculo_imprensa} 
                    onChange={handleChange} 
                    className={`mt-1 ${hasFieldError('veiculo_imprensa', errors) ? 'border-orange-500' : ''}`}
                  />
                  {hasFieldError('veiculo_imprensa', errors) && (
                    <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('veiculo_imprensa', errors)}</p>
                  )}
                </div>
                
                <div>
                  <Label 
                    htmlFor="telefone_solicitante" 
                    className={`font-semibold ${hasFieldError('telefone_solicitante', errors) ? 'text-orange-500' : ''}`}
                  >
                    Telefone
                  </Label>
                  <Input
                    id="telefone_solicitante"
                    name="telefone_solicitante"
                    value={formData.telefone_solicitante}
                    onChange={handleChange}
                    className={`mt-1 ${hasFieldError('telefone_solicitante', errors) ? 'border-orange-500' : ''}`}
                    placeholder="(XX) XXXXX-XXXX"
                  />
                  {hasFieldError('telefone_solicitante', errors) && (
                    <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('telefone_solicitante', errors)}</p>
                  )}
                </div>
                
                <div>
                  <Label 
                    htmlFor="email_solicitante" 
                    className={`font-semibold ${hasFieldError('email_solicitante', errors) ? 'text-orange-500' : ''}`}
                  >
                    Email
                  </Label>
                  <Input
                    id="email_solicitante"
                    name="email_solicitante"
                    type="email"
                    value={formData.email_solicitante}
                    onChange={handleChange}
                    className={`mt-1 ${hasFieldError('email_solicitante', errors) ? 'border-orange-500' : ''}`}
                  />
                  {hasFieldError('email_solicitante', errors) && (
                    <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('email_solicitante', errors)}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Always show these fields regardless of origin
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label 
              htmlFor="nome_solicitante" 
              className={`font-semibold ${hasFieldError('nome_solicitante', errors) ? 'text-orange-500' : ''}`}
            >
              Nome do Solicitante
            </Label>
            <Input
              id="nome_solicitante"
              name="nome_solicitante"
              value={formData.nome_solicitante}
              onChange={handleChange}
              className={`mt-1 ${hasFieldError('nome_solicitante', errors) ? 'border-orange-500' : ''}`}
            />
            {hasFieldError('nome_solicitante', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('nome_solicitante', errors)}</p>
            )}
          </div>
          
          <div>
            <Label 
              htmlFor="telefone_solicitante" 
              className={`font-semibold ${hasFieldError('telefone_solicitante', errors) ? 'text-orange-500' : ''}`}
            >
              Telefone
            </Label>
            <Input
              id="telefone_solicitante"
              name="telefone_solicitante"
              value={formData.telefone_solicitante}
              onChange={handleChange}
              className={`mt-1 ${hasFieldError('telefone_solicitante', errors) ? 'border-orange-500' : ''}`}
              placeholder="(XX) XXXXX-XXXX"
            />
            {hasFieldError('telefone_solicitante', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('telefone_solicitante', errors)}</p>
            )}
          </div>
          
          <div>
            <Label 
              htmlFor="email_solicitante" 
              className={`font-semibold ${hasFieldError('email_solicitante', errors) ? 'text-orange-500' : ''}`}
            >
              Email
            </Label>
            <Input
              id="email_solicitante"
              name="email_solicitante"
              type="email"
              value={formData.email_solicitante}
              onChange={handleChange}
              className={`mt-1 ${hasFieldError('email_solicitante', errors) ? 'border-orange-500' : ''}`}
            />
            {hasFieldError('email_solicitante', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('email_solicitante', errors)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequesterInfoStep;
