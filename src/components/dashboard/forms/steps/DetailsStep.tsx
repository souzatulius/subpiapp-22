
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ValidationError } from '@/lib/formValidationUtils';
import { Book, Newspaper, Monitor, MousePointer, Globe, HelpCircle, Mic, Tv, Radio } from 'lucide-react';

interface DetailsStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    veiculo_imprensa: string;
    detalhes_solicitacao: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  origens: any[];
  tiposMidia: any[];
  errors?: ValidationError[];
}

const DetailsStep: React.FC<DetailsStepProps> = ({
  formData,
  handleChange,
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
  
  // Verifica se a origem está entre as que devem mostrar tipo de mídia
  const selectedOrigin = origens.find(origem => origem.id === formData.origem_id);
  const showMediaFields = selectedOrigin?.descricao === "Imprensa" || 
                         selectedOrigin?.descricao === "SMSUB" ||
                         selectedOrigin?.descricao === "SECOM";
  
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
      {showMediaFields && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="tipo_midia_id" 
            className={`block mb-2 ${hasError('tipo_midia_id') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Tipo de Mídia
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tiposMidia.map(tipo => (
              <Button 
                key={tipo.id} 
                type="button" 
                variant={formData.tipo_midia_id === tipo.id ? "default" : "outline"} 
                className={`h-auto py-3 flex flex-col items-center justify-center gap-2 rounded-xl ${
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
      
      {formData.tipo_midia_id && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="veiculo_imprensa" 
            className={`block mb-2 ${hasError('veiculo_imprensa') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Qual é o veículo de imprensa?
          </Label>
          <Input 
            id="veiculo_imprensa" 
            name="veiculo_imprensa" 
            value={formData.veiculo_imprensa} 
            onChange={handleChange} 
            className={`rounded-xl ${hasError('veiculo_imprensa') ? 'border-orange-500' : ''}`}
          />
          {hasError('veiculo_imprensa') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('veiculo_imprensa')}</p>
          )}
        </div>
      )}
      
      <div>
        <Label 
          htmlFor="detalhes_solicitacao" 
          className={`block mb-2 ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Detalhes da Solicitação
        </Label>
        <Textarea 
          id="detalhes_solicitacao" 
          name="detalhes_solicitacao" 
          value={formData.detalhes_solicitacao} 
          onChange={handleChange} 
          className={`min-h-[150px] rounded-xl ${hasError('detalhes_solicitacao') ? 'border-orange-500' : ''}`}
          placeholder="Digite aqui..."
        />
        {hasError('detalhes_solicitacao') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
        )}
      </div>
    </div>
  );
};

export default DetailsStep;
