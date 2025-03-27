
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '@/components/dashboard/forms/steps/identification/ValidationUtils';

interface PracticalInfoStepProps {
  formData: {
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
    veiculo_imprensa: string;
    endereco: string;
    bairro_id: string;
  };
  distritos: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  filteredBairros: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors?: ValidationError[];
}

const PracticalInfoStep: React.FC<PracticalInfoStepProps> = ({
  formData,
  distritos,
  selectedDistrito,
  setSelectedDistrito,
  filteredBairros,
  handleChange,
  handleSelectChange,
  errors = []
}) => {
  const [showDistrito, setShowDistrito] = useState(false);
  const [showBairro, setShowBairro] = useState(false);
  const [showEndereco, setShowEndereco] = useState(false);

  // Check email to determine if we should show district selection
  useEffect(() => {
    const emailIsValid = formData.email_solicitante && formData.email_solicitante.trim() !== '';
    setShowDistrito(emailIsValid);
    
    // If email becomes invalid, hide subsequent fields
    if (!emailIsValid) {
      setShowBairro(false);
      setShowEndereco(false);
    }
  }, [formData.email_solicitante]);

  // Check district to determine if we should show neighborhood selection
  useEffect(() => {
    const distritoIsValid = selectedDistrito && selectedDistrito.trim() !== '';
    setShowBairro(distritoIsValid && showDistrito);
    
    // If district becomes invalid, hide address field
    if (!distritoIsValid) {
      setShowEndereco(false);
    }
  }, [selectedDistrito, showDistrito]);

  // Check bairro_id to determine if we should show address field
  useEffect(() => {
    const bairroIsValid = formData.bairro_id && formData.bairro_id.trim() !== '';
    setShowEndereco(bairroIsValid && showBairro);
  }, [formData.bairro_id, showBairro]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações do Solicitante</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label 
              htmlFor="nome_solicitante" 
              className={`${hasFieldError('nome_solicitante', errors) ? 'text-orange-500 font-semibold' : ''}`}
            >
              Nome do Solicitante {hasFieldError('nome_solicitante', errors) && <span className="text-orange-500">*</span>}
            </Label>
            <Input
              id="nome_solicitante"
              name="nome_solicitante"
              value={formData.nome_solicitante}
              onChange={handleChange}
              className={`${hasFieldError('nome_solicitante', errors) ? 'border-orange-500' : ''}`}
            />
            {hasFieldError('nome_solicitante', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('nome_solicitante', errors)}</p>
            )}
          </div>
          
          <div>
            <Label 
              htmlFor="telefone_solicitante"
              className={`${hasFieldError('telefone_solicitante', errors) ? 'text-orange-500 font-semibold' : ''}`}
            >
              Telefone {hasFieldError('telefone_solicitante', errors) && <span className="text-orange-500">*</span>}
            </Label>
            <Input
              id="telefone_solicitante"
              name="telefone_solicitante"
              value={formData.telefone_solicitante}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className={`${hasFieldError('telefone_solicitante', errors) ? 'border-orange-500' : ''}`}
            />
            {hasFieldError('telefone_solicitante', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('telefone_solicitante', errors)}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label 
              htmlFor="email_solicitante"
              className={`${hasFieldError('email_solicitante', errors) ? 'text-orange-500 font-semibold' : ''}`}
            >
              Email {hasFieldError('email_solicitante', errors) && <span className="text-orange-500">*</span>}
            </Label>
            <Input
              id="email_solicitante"
              name="email_solicitante"
              type="email"
              value={formData.email_solicitante}
              onChange={handleChange}
              className={`${hasFieldError('email_solicitante', errors) ? 'border-orange-500' : ''}`}
            />
            {hasFieldError('email_solicitante', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('email_solicitante', errors)}</p>
            )}
          </div>
          
          <div>
            <Label 
              htmlFor="veiculo_imprensa"
              className={`${hasFieldError('veiculo_imprensa', errors) ? 'text-orange-500 font-semibold' : ''}`}
            >
              Veículo de Imprensa {hasFieldError('veiculo_imprensa', errors) && <span className="text-orange-500">*</span>}
            </Label>
            <Input
              id="veiculo_imprensa"
              name="veiculo_imprensa"
              value={formData.veiculo_imprensa}
              onChange={handleChange}
              className={`${hasFieldError('veiculo_imprensa', errors) ? 'border-orange-500' : ''}`}
            />
            {hasFieldError('veiculo_imprensa', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('veiculo_imprensa', errors)}</p>
            )}
          </div>
        </div>
      </div>
      
      {showDistrito && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold">Localização</h3>
          
          <div>
            <Label 
              htmlFor="distrito" 
              className={`block mb-2 ${hasFieldError('distrito', errors) ? 'text-orange-500 font-semibold' : ''}`}
            >
              Distrito {hasFieldError('distrito', errors) && <span className="text-orange-500">*</span>}
            </Label>
            <div className="flex flex-wrap gap-2">
              {distritos.map(distrito => (
                <Button 
                  key={distrito.id} 
                  type="button" 
                  variant={selectedDistrito === distrito.id ? "default" : "outline"} 
                  className="h-auto py-2 px-3"
                  onClick={() => setSelectedDistrito(distrito.id)}
                >
                  {distrito.nome}
                </Button>
              ))}
            </div>
            {hasFieldError('distrito', errors) && (
              <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('distrito', errors)}</p>
            )}
          </div>
          
          {showBairro && (
            <div className="animate-fadeIn">
              <Label 
                htmlFor="bairro_id" 
                className={`block mb-2 ${hasFieldError('bairro_id', errors) ? 'text-orange-500 font-semibold' : ''}`}
              >
                Bairro {hasFieldError('bairro_id', errors) && <span className="text-orange-500">*</span>}
              </Label>
              <div className="flex flex-wrap gap-2">
                {filteredBairros.map(bairro => (
                  <Button 
                    key={bairro.id} 
                    type="button" 
                    variant={formData.bairro_id === bairro.id ? "default" : "outline"} 
                    className="h-auto py-2 px-3"
                    onClick={() => handleSelectChange('bairro_id', bairro.id)}
                  >
                    {bairro.nome}
                  </Button>
                ))}
              </div>
              {hasFieldError('bairro_id', errors) && (
                <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('bairro_id', errors)}</p>
              )}
            </div>
          )}
          
          {showEndereco && (
            <div className="animate-fadeIn">
              <Label 
                htmlFor="endereco"
                className={`${hasFieldError('endereco', errors) ? 'text-orange-500 font-semibold' : ''}`}
              >
                Endereço {hasFieldError('endereco', errors) && <span className="text-orange-500">*</span>}
              </Label>
              <Input
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Ex: Rua Example, 123"
                className={`${hasFieldError('endereco', errors) ? 'border-orange-500' : ''}`}
              />
              {hasFieldError('endereco', errors) && (
                <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('endereco', errors)}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticalInfoStep;
