
import React from 'react';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { Building, Phone, Mail, MessageSquare, Newspaper, Users, Flag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Protocolo156 from './identification/Protocolo156';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface OriginStepProps {
  formData: {
    origem_id: string;
    prazo_resposta: string;
    tem_protocolo_156?: boolean;
    numero_protocolo_156?: string;
  };
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  origens: any[];
  errors: ValidationError[];
}

const OriginStep: React.FC<OriginStepProps> = ({
  formData,
  handleSelectChange,
  handleChange,
  origens,
  errors
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Get origin icon based on description
  const getOriginIcon = (descricao: string) => {
    const iconMap: {
      [key: string]: React.ReactNode;
    } = {
      "Imprensa": <Newspaper className="h-5 w-5" />,
      "SMSUB": <Building className="h-5 w-5" />,
      "SECOM": <MessageSquare className="h-5 w-5" />,
      "Telefone": <Phone className="h-5 w-5" />,
      "Email": <Mail className="h-5 w-5" />,
      "Ouvidoria": <Users className="h-5 w-5" />,
      "Outros": <Flag className="h-5 w-5" />
    };
    return iconMap[descricao] || <Flag className="h-5 w-5" />;
  };

  // Protocol selection and deadline fields
  const showProtocolField = formData.origem_id !== '';
  const showDeadlineField = 
    formData.origem_id !== '' && 
    (formData.tem_protocolo_156 === false || 
     (formData.tem_protocolo_156 === true && formData.numero_protocolo_156 && formData.numero_protocolo_156.length > 0));

  return (
    <div className="space-y-6">
      <div>
        <label 
          htmlFor="origem_id" 
          className={`block mb-2 font-medium ${hasError('origem_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          De onde vem a sua solicitação? {hasError('origem_id') && <span className="text-orange-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {origens.map(origem => (
            <Button 
              key={origem.id} 
              type="button" 
              variant={formData.origem_id === origem.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 rounded-xl ${
                formData.origem_id === origem.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('origem_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleSelectChange('origem_id', origem.id)}
            >
              {getOriginIcon(origem.descricao)}
              <span className="text-sm font-semibold">{origem.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('origem_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('origem_id')}</p>
        )}
      </div>

      {showProtocolField && (
        <div className="animate-fadeIn">
          <Protocolo156
            temProtocolo156={formData.tem_protocolo_156}
            numeroProtocolo156={formData.numero_protocolo_156}
            handleSelectChange={(checked: boolean) => handleSelectChange('tem_protocolo_156', checked)}
            handleChange={(e) => handleChange(e)}
            errors={errors}
          />
        </div>
      )}

      {showDeadlineField && (
        <div className="animate-fadeIn">
          <Label className={`block font-medium ${hasError('prazo_resposta') ? 'text-orange-500' : ''}`}>
            Prazo para Resposta {hasError('prazo_resposta') && <span className="text-orange-500">*</span>}
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Input 
                type="date" 
                id="prazo_resposta_date" 
                name="prazo_resposta" 
                value={formData.prazo_resposta ? formData.prazo_resposta.split('T')[0] : ''} 
                onChange={(e) => {
                  const timeValue = formData.prazo_resposta 
                    ? formData.prazo_resposta.split('T')[1] 
                    : '12:00:00';
                  handleChange({
                    target: {
                      name: 'prazo_resposta',
                      value: `${e.target.value}T${timeValue}`
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className={hasError('prazo_resposta') ? 'border-orange-500' : ''}
              />
            </div>
            <div>
              <select
                id="prazo_resposta_time"
                className={`w-full h-10 px-3 py-2 border rounded-md ${hasError('prazo_resposta') ? 'border-orange-500' : 'border-gray-300'}`}
                onChange={(e) => {
                  const dateValue = formData.prazo_resposta 
                    ? formData.prazo_resposta.split('T')[0] 
                    : new Date().toISOString().split('T')[0];
                  handleChange({
                    target: {
                      name: 'prazo_resposta',
                      value: `${dateValue}T${e.target.value}:00`
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                value={formData.prazo_resposta ? formData.prazo_resposta.split('T')[1].substring(0, 5) : '12:00'}
              >
                {Array.from({ length: 17 }, (_, i) => i + 6).map(hour => (
                  <React.Fragment key={hour}>
                    <option value={`${hour.toString().padStart(2, '0')}:00`}>{hour.toString().padStart(2, '0')}:00</option>
                    <option value={`${hour.toString().padStart(2, '0')}:30`}>{hour.toString().padStart(2, '0')}:30</option>
                  </React.Fragment>
                ))}
              </select>
            </div>
          </div>
          {hasError('prazo_resposta') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prazo_resposta')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OriginStep;
