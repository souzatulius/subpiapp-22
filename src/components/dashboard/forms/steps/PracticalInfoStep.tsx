
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError } from '@/lib/formValidationUtils';

interface PracticalInfoStepProps {
  formData: {
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
    prioridade: string;
    bairro_id: string;
    endereco: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  distritos: any[];
  selectedDistrito: string;
  setSelectedDistrito: (distrito: string) => void;
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

  // Função para formatar o telefone
  const formatPhone = (value: string): string => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Formata conforme quantidade de dígitos
    if (numbers.length <= 2) {
      return `(${numbers}`;
    }
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
    handleChange(e);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="nome_solicitante" 
          className={`block mb-2 ${hasError('nome_solicitante') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Nome do Solicitante
        </Label>
        <Input 
          id="nome_solicitante" 
          name="nome_solicitante" 
          value={formData.nome_solicitante} 
          onChange={handleChange} 
          className={`rounded-xl ${hasError('nome_solicitante') ? 'border-orange-500' : ''}`}
        />
        {hasError('nome_solicitante') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('nome_solicitante')}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="telefone_solicitante" 
          className={`block mb-2 ${hasError('telefone_solicitante') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Telefone do Solicitante
        </Label>
        <Input 
          id="telefone_solicitante" 
          name="telefone_solicitante" 
          value={formData.telefone_solicitante} 
          onChange={handlePhoneChange} 
          className={`rounded-xl ${hasError('telefone_solicitante') ? 'border-orange-500' : ''}`}
          placeholder="(00) 00000-0000"
        />
        {hasError('telefone_solicitante') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('telefone_solicitante')}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="email_solicitante" 
          className={`block mb-2 ${hasError('email_solicitante') ? 'text-orange-500 font-semibold' : ''}`}
        >
          E-mail do Solicitante
        </Label>
        <Input 
          id="email_solicitante" 
          name="email_solicitante" 
          type="email"
          value={formData.email_solicitante} 
          onChange={handleChange} 
          className={`rounded-xl ${hasError('email_solicitante') ? 'border-orange-500' : ''}`}
        />
        {hasError('email_solicitante') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('email_solicitante')}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="prioridade" 
          className={`block mb-2 ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prioridade
        </Label>
        <Select 
          value={formData.prioridade} 
          onValueChange={(value) => handleSelectChange('prioridade', value)}
        >
          <SelectTrigger className={`w-full rounded-xl ${hasError('prioridade') ? 'border-orange-500' : ''}`}>
            <SelectValue placeholder="Selecione a prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
        {hasError('prioridade') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prioridade')}</p>
        )}
      </div>

      <div>
        <Label htmlFor="distrito" className="block mb-2">
          Distrito
        </Label>
        <Select 
          value={selectedDistrito} 
          onValueChange={setSelectedDistrito}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Selecione o distrito" />
          </SelectTrigger>
          <SelectContent>
            {distritos.map(distrito => (
              <SelectItem key={distrito.id} value={distrito.id}>
                {distrito.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label 
          htmlFor="bairro_id" 
          className={`block mb-2 ${hasError('bairro_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Bairro
        </Label>
        <Select 
          value={formData.bairro_id} 
          onValueChange={(value) => handleSelectChange('bairro_id', value)}
          disabled={!selectedDistrito}
        >
          <SelectTrigger className={`w-full rounded-xl ${hasError('bairro_id') ? 'border-orange-500' : ''}`}>
            <SelectValue placeholder={selectedDistrito ? "Selecione o bairro" : "Selecione primeiro o distrito"} />
          </SelectTrigger>
          <SelectContent>
            {filteredBairros.map(bairro => (
              <SelectItem key={bairro.id} value={bairro.id}>
                {bairro.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError('bairro_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('bairro_id')}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="endereco" 
          className={`block mb-2 ${hasError('endereco') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Endereço (opcional)
        </Label>
        <Input 
          id="endereco" 
          name="endereco" 
          value={formData.endereco || ''} 
          onChange={handleChange} 
          className={`rounded-xl ${hasError('endereco') ? 'border-orange-500' : ''}`}
        />
        {hasError('endereco') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('endereco')}</p>
        )}
      </div>
    </div>
  );
};

export default PracticalInfoStep;
