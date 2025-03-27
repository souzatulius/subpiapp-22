
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import LocationStep from './LocationStep';

interface PracticalInfoStepProps {
  formData: {
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
    prioridade: string;
    endereco: string;
    bairro_id: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  distritos: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  filteredBairros: any[];
  errors?: ValidationError[];
}

const PracticalInfoStep: React.FC<PracticalInfoStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  distritos,
  selectedDistrito,
  setSelectedDistrito,
  filteredBairros,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const [showTelefone, setShowTelefone] = useState(!!formData.nome_solicitante);
  const [showEmail, setShowEmail] = useState(!!formData.telefone_solicitante);

  useEffect(() => {
    if (formData.nome_solicitante) setShowTelefone(true);
    if (formData.telefone_solicitante) setShowEmail(true);
  }, [formData.nome_solicitante, formData.telefone_solicitante]);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    if (e.target.value) setShowTelefone(true);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Formatação do telefone
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length <= 2) {
      formattedValue = value;
    } else if (value.length <= 6) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, value.length > 10 ? 7 : 6)}-${value.slice(value.length > 10 ? 7 : 6)}`;
    } else {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'telefone_solicitante',
        value: formattedValue
      }
    };
    
    handleChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    if (formattedValue) setShowEmail(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label 
          htmlFor="nome_solicitante" 
          className={`${hasError('nome_solicitante') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Quem enviou a solicitação?
        </Label>
        <Input 
          id="nome_solicitante" 
          name="nome_solicitante" 
          value={formData.nome_solicitante} 
          onChange={handleNomeChange} 
          className={`rounded-xl ${hasError('nome_solicitante') ? 'border-orange-500' : ''}`}
          placeholder="Nome do solicitante"
        />
        {hasError('nome_solicitante') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('nome_solicitante')}</p>
        )}
      </div>

      {showTelefone && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="telefone_solicitante" 
            className={`${hasError('telefone_solicitante') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Qual o telefone?
          </Label>
          <Input 
            id="telefone_solicitante" 
            name="telefone_solicitante" 
            value={formData.telefone_solicitante} 
            onChange={handleTelefoneChange} 
            className={`rounded-xl ${hasError('telefone_solicitante') ? 'border-orange-500' : ''}`}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
          {hasError('telefone_solicitante') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('telefone_solicitante')}</p>
          )}
        </div>
      )}

      {showEmail && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="email_solicitante" 
            className={`${hasError('email_solicitante') ? 'text-orange-500 font-semibold' : ''}`}
          >
            E o e-mail?
          </Label>
          <Input 
            id="email_solicitante" 
            name="email_solicitante" 
            type="email"
            value={formData.email_solicitante} 
            onChange={handleEmailChange} 
            className={`rounded-xl ${hasError('email_solicitante') ? 'border-orange-500' : ''}`}
            placeholder="email@exemplo.com"
          />
          {hasError('email_solicitante') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('email_solicitante')}</p>
          )}
        </div>
      )}

      {/* Removed the Priority field that was duplicated from Step 1 */}
      
      {/* Location selection section with the districts and neighborhoods as buttons */}
      <LocationStep
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        distritos={distritos}
        selectedDistrito={selectedDistrito}
        setSelectedDistrito={setSelectedDistrito}
        filteredBairros={filteredBairros}
        errors={errors}
      />
    </div>
  );
};

export default PracticalInfoStep;
