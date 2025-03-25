
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';
import { AlertCircle } from 'lucide-react';

interface ReviewStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: ValidationError[];
  problemas: any[];
  servicos: any[];
  origens: any[];
  tiposMidia: any[];
  filteredBairros: any[];
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  handleChange,
  errors,
  problemas,
  servicos,
  origens,
  tiposMidia,
  filteredBairros
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const selectedProblema = problemas.find(p => p.id === formData.problema_id);
  const selectedOrigem = origens.find(o => o.id === formData.origem_id);
  const selectedTipoMidia = tiposMidia.find(t => t.id === formData.tipo_midia_id);
  const selectedBairro = filteredBairros.find(b => b.id === formData.bairro_id);
  
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="titulo" className={`block mb-2 ${hasError('titulo') ? 'text-orange-500 font-semibold' : ''}`}>
          Título da Demanda {hasError('titulo') && <span className="text-orange-500">*</span>}
        </Label>
        <Input
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={hasError('titulo') ? 'border-orange-500 focus:ring-orange-500' : ''}
          placeholder="Título da demanda"
        />
        {hasError('titulo') && (
          <div className="flex items-center mt-2 text-orange-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <p>{getErrorMessage('titulo')}</p>
          </div>
        )}
        {!hasError('titulo') && (
          <p className="text-gray-500 text-sm mt-1">
            O título da demanda é obrigatório para finalizar o cadastro.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block mb-2">Tema</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {selectedProblema ? selectedProblema.descricao : 'Não selecionado'}
          </div>
        </div>
        
        {/* Service information is now omitted since it will be selected later */}

        <div>
          <Label className="block mb-2">Origem</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {selectedOrigem ? selectedOrigem.descricao : 'Não selecionada'}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Tipo de Mídia</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {selectedTipoMidia ? selectedTipoMidia.descricao : 'Não selecionado'}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Prioridade</Label>
          <div className="p-2 border rounded-md bg-gray-50 capitalize">
            {formData.prioridade}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Prazo</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {formData.prazo_resposta ? new Date(formData.prazo_resposta).toLocaleDateString('pt-BR') : 'Não definido'}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Solicitante</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {formData.nome_solicitante || 'Não informado'}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Telefone</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {formData.telefone_solicitante || 'Não informado'}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Email</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {formData.email_solicitante || 'Não informado'}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Veículo de Imprensa</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {formData.veiculo_imprensa || 'Não informado'}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Endereço</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {formData.endereco || 'Não informado'}
          </div>
        </div>

        <div>
          <Label className="block mb-2">Bairro</Label>
          <div className="p-2 border rounded-md bg-gray-50">
            {selectedBairro ? selectedBairro.nome : 'Não selecionado'}
          </div>
        </div>
      </div>

      <div>
        <Label className="block mb-2">Perguntas</Label>
        <div className="p-3 border rounded-md bg-gray-50">
          {formData.perguntas.filter(Boolean).length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {formData.perguntas.filter(Boolean).map((pergunta: string, index: number) => (
                <li key={index}>{pergunta}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhuma pergunta cadastrada</p>
          )}
        </div>
      </div>

      <div>
        <Label className="block mb-2">Detalhes da Solicitação</Label>
        <div className="p-3 border rounded-md bg-gray-50 whitespace-pre-line">
          {formData.detalhes_solicitacao || 'Não informado'}
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
