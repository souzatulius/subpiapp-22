
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface LocationStepProps {
  formData: {
    problema_id: string;
    servico_id: string;
    nao_sabe_servico: boolean;
    detalhes_solicitacao: string;
    endereco: string;
    bairro_id: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  distritos: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  filteredBairros: any[];
  errors: ValidationError[];
  problemas: any[];
  servicos: any[];
  filteredServicos: any[];
  serviceSearch: string;
  handleServiceSearch?: (value: string) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  distritos,
  selectedDistrito,
  setSelectedDistrito,
  filteredBairros,
  errors,
  problemas,
  servicos,
  filteredServicos,
  serviceSearch,
  handleServiceSearch
}) => {
  return (
    <div className="space-y-6">
      {/* Tema/Problema */}
      <div>
        <Label 
          htmlFor="problema_id" 
          className={hasFieldError('problema_id', errors) ? 'text-orange-500' : ''}
        >
          Tema
        </Label>
        <Select
          value={formData.problema_id}
          onValueChange={(value) => handleSelectChange('problema_id', value)}
        >
          <SelectTrigger 
            className={`w-full ${hasFieldError('problema_id', errors) ? 'border-orange-500' : ''}`}
          >
            <SelectValue placeholder="Selecione o tema relacionado à demanda" />
          </SelectTrigger>
          <SelectContent>
            {problemas.map((problema) => (
              <SelectItem key={problema.id} value={problema.id}>
                {problema.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFieldError('problema_id', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('problema_id', errors)}</p>
        )}
      </div>

      {/* Serviço */}
      {formData.problema_id && (
        <div className="space-y-2 animate-fadeIn">
          <Label 
            htmlFor="servico_id" 
            className={hasFieldError('servico_id', errors) ? 'text-orange-500' : ''}
          >
            Serviço
          </Label>

          <div className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id="nao_sabe_servico" 
              checked={formData.nao_sabe_servico} 
              onCheckedChange={(checked) => handleSelectChange('nao_sabe_servico', !!checked)} 
            />
            <label htmlFor="nao_sabe_servico" className="text-sm cursor-pointer">
              Não sei o serviço específico
            </label>
          </div>

          {!formData.nao_sabe_servico && (
            <>
              {handleServiceSearch && (
                <Input 
                  type="text" 
                  placeholder="Buscar serviço..." 
                  value={serviceSearch} 
                  onChange={(e) => handleServiceSearch(e.target.value)} 
                  className="mb-2"
                />
              )}
              <Select
                value={formData.servico_id}
                onValueChange={(value) => handleSelectChange('servico_id', value)}
                disabled={formData.nao_sabe_servico}
              >
                <SelectTrigger 
                  className={`w-full ${hasFieldError('servico_id', errors) ? 'border-orange-500' : ''}`}
                >
                  <SelectValue placeholder="Selecione o serviço relacionado à demanda" />
                </SelectTrigger>
                <SelectContent>
                  {filteredServicos.length > 0 ? (
                    filteredServicos.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.descricao}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-servicos" disabled>
                      Nenhum serviço encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {hasFieldError('servico_id', errors) && !formData.nao_sabe_servico && (
                <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('servico_id', errors)}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Detalhes da Solicitação */}
      <div>
        <Label 
          htmlFor="detalhes_solicitacao" 
          className={hasFieldError('detalhes_solicitacao', errors) ? 'text-orange-500' : ''}
        >
          Detalhes da Solicitação
        </Label>
        <Textarea
          id="detalhes_solicitacao"
          name="detalhes_solicitacao"
          value={formData.detalhes_solicitacao}
          onChange={handleChange}
          className={`min-h-[150px] ${hasFieldError('detalhes_solicitacao', errors) ? 'border-orange-500' : ''}`}
          placeholder="Descreva os detalhes da solicitação..."
        />
        {hasFieldError('detalhes_solicitacao', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('detalhes_solicitacao', errors)}</p>
        )}
      </div>

      {/* Distrito */}
      <div>
        <Label 
          htmlFor="distrito" 
          className={hasFieldError('bairro_id', errors) ? 'text-orange-500' : ''}
        >
          Distrito
        </Label>
        <Select
          value={selectedDistrito}
          onValueChange={setSelectedDistrito}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o distrito" />
          </SelectTrigger>
          <SelectContent>
            {distritos.map((distrito) => (
              <SelectItem key={distrito.id} value={distrito.id}>
                {distrito.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bairro - mostra apenas quando um distrito é selecionado */}
      {selectedDistrito && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="bairro_id" 
            className={hasFieldError('bairro_id', errors) ? 'text-orange-500' : ''}
          >
            Bairro
          </Label>
          <Select
            value={formData.bairro_id}
            onValueChange={(value) => handleSelectChange('bairro_id', value)}
          >
            <SelectTrigger 
              className={`w-full ${hasFieldError('bairro_id', errors) ? 'border-orange-500' : ''}`}
            >
              <SelectValue placeholder="Selecione o bairro" />
            </SelectTrigger>
            <SelectContent>
              {filteredBairros.length > 0 ? (
                filteredBairros.map((bairro) => (
                  <SelectItem key={bairro.id} value={bairro.id}>
                    {bairro.nome}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-bairros" disabled>
                  Nenhum bairro encontrado
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {hasFieldError('bairro_id', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('bairro_id', errors)}</p>
          )}
        </div>
      )}

      {/* Endereço */}
      <div>
        <Label 
          htmlFor="endereco" 
          className={hasFieldError('endereco', errors) ? 'text-orange-500' : ''}
        >
          Endereço
        </Label>
        <Input
          id="endereco"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          className={hasFieldError('endereco', errors) ? 'border-orange-500' : ''}
          placeholder="Rua, número, complemento, etc."
        />
        {hasFieldError('endereco', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('endereco', errors)}</p>
        )}
      </div>
    </div>
  );
};

export default LocationStep;
