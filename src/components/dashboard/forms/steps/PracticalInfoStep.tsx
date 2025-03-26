
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError } from '@/lib/formValidationUtils';

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
  const [showTelefone, setShowTelefone] = useState(!!formData.nome_solicitante);
  const [showEmail, setShowEmail] = useState(!!formData.telefone_solicitante);
  const [showPrioridade, setShowPrioridade] = useState(!!formData.email_solicitante);
  const [showDistrito, setShowDistrito] = useState(!!formData.prioridade);
  const [showBairro, setShowBairro] = useState(!!selectedDistrito);
  const [showEndereco, setShowEndereco] = useState(!!formData.bairro_id);

  useEffect(() => {
    if (formData.nome_solicitante) setShowTelefone(true);
    if (formData.telefone_solicitante) setShowEmail(true);
    if (formData.email_solicitante) setShowPrioridade(true);
    if (formData.prioridade) setShowDistrito(true);
    if (selectedDistrito) setShowBairro(true);
    if (formData.bairro_id) setShowEndereco(true);
  }, [formData, selectedDistrito]);

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
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
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
    if (e.target.value) setShowPrioridade(true);
  };

  const handlePrioridadeChange = (value: string) => {
    handleSelectChange('prioridade', value);
    setShowDistrito(true);
  };

  const handleDistritoChange = (value: string) => {
    setSelectedDistrito(value);
    setShowBairro(true);
  };

  const handleBairroChange = (value: string) => {
    handleSelectChange('bairro_id', value);
    setShowEndereco(true);
  };

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
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

      {showPrioridade && (
        <div className="animate-fadeIn">
          <Label 
            className={`block mb-2 ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Prioridade {hasError('prioridade') && <span className="text-orange-500">*</span>}
          </Label>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant={formData.prioridade === 'baixa' ? "default" : "outline"} 
              onClick={() => handlePrioridadeChange('baixa')}
              className={`flex-1 bg-green-500 hover:bg-green-600 border-green-500 ${formData.prioridade === 'baixa' ? '' : 'text-green-700 bg-green-50 hover:text-white'}`}
            >
              Baixa
            </Button>
            <Button 
              type="button" 
              variant={formData.prioridade === 'media' ? "default" : "outline"} 
              onClick={() => handlePrioridadeChange('media')}
              className={`flex-1 bg-yellow-500 hover:bg-yellow-600 border-yellow-500 ${formData.prioridade === 'media' ? '' : 'text-yellow-700 bg-yellow-50 hover:text-white'}`}
            >
              Média
            </Button>
            <Button 
              type="button" 
              variant={formData.prioridade === 'alta' ? "default" : "outline"} 
              onClick={() => handlePrioridadeChange('alta')}
              className={`flex-1 bg-red-500 hover:bg-red-600 border-red-500 ${formData.prioridade === 'alta' ? '' : 'text-red-700 bg-red-50 hover:text-white'}`}
            >
              Alta
            </Button>
          </div>
          {hasError('prioridade') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prioridade')}</p>
          )}
        </div>
      )}

      {showDistrito && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="distrito" 
            className={`block mb-2 ${hasError('distrito') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Distrito {hasError('distrito') && <span className="text-orange-500">*</span>}
          </Label>
          <Select 
            value={selectedDistrito} 
            onValueChange={handleDistritoChange}
          >
            <SelectTrigger className={`rounded-xl ${hasError('distrito') ? 'border-orange-500' : ''}`}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {distritos.map(distrito => (
                  <SelectItem key={distrito.id} value={distrito.id}>
                    {distrito.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {hasError('distrito') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('distrito')}</p>
          )}
        </div>
      )}

      {showBairro && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="bairro_id" 
            className={`block mb-2 ${hasError('bairro_id') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Bairro {hasError('bairro_id') && <span className="text-orange-500">*</span>}
          </Label>
          <Select 
            value={formData.bairro_id} 
            onValueChange={(value) => handleBairroChange(value)}
          >
            <SelectTrigger className={`rounded-xl ${hasError('bairro_id') ? 'border-orange-500' : ''}`}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filteredBairros.map(bairro => (
                  <SelectItem key={bairro.id} value={bairro.id}>
                    {bairro.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {hasError('bairro_id') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('bairro_id')}</p>
          )}
        </div>
      )}

      {showEndereco && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="endereco" 
            className={`block mb-2 ${hasError('endereco') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Endereço {hasError('endereco') && <span className="text-orange-500">*</span>}
          </Label>
          <Input 
            id="endereco" 
            name="endereco" 
            value={formData.endereco} 
            onChange={handleChange} 
            className={`rounded-xl ${hasError('endereco') ? 'border-orange-500' : ''}`}
            placeholder="Rua, número, complemento"
          />
          {hasError('endereco') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('endereco')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticalInfoStep;
