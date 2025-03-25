
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';

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
          className={hasError('titulo') ? 'border-orange-500' : ''}
          placeholder="Título da demanda"
        />
        {hasError('titulo') && (
          <p className="text-orange-500 text-sm mt-1">
            {getErrorMessage('titulo')}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Sugestão baseada no serviço e bairro selecionados. Você pode editá-lo conforme necessário.
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Resumo da Demanda</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold">Tema:</p>
            <p className="text-sm text-gray-700">
              {problemas.find(p => p.id === formData.problema_id)?.descricao || '-'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Serviço:</p>
            <p className="text-sm text-gray-700">
              {servicos.find(s => s.id === formData.servico_id)?.descricao || '-'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Origem:</p>
            <p className="text-sm text-gray-700">
              {origens.find(o => o.id === formData.origem_id)?.descricao || '-'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Tipo de Mídia:</p>
            <p className="text-sm text-gray-700">
              {tiposMidia.find(t => t.id === formData.tipo_midia_id)?.descricao || '-'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Solicitante:</p>
            <p className="text-sm text-gray-700">{formData.nome_solicitante || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Prioridade:</p>
            <p className="text-sm text-gray-700">{formData.prioridade || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Prazo de Resposta:</p>
            <p className="text-sm text-gray-700">
              {formData.prazo_resposta ? new Date(formData.prazo_resposta).toLocaleDateString('pt-BR') : '-'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Bairro:</p>
            <p className="text-sm text-gray-700">
              {filteredBairros.find(b => b.id === formData.bairro_id)?.nome || '-'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Endereço:</p>
            <p className="text-sm text-gray-700">{formData.endereco || '-'}</p>
          </div>
          
          {formData.veiculo_imprensa && (
            <div>
              <p className="text-sm font-semibold">Veículo de Imprensa:</p>
              <p className="text-sm text-gray-700">{formData.veiculo_imprensa}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-semibold">Detalhes da Solicitação:</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.detalhes_solicitacao || '-'}</p>
        </div>
        
        {formData.perguntas.some(p => p.trim() !== '') && (
          <div className="mt-4">
            <p className="text-sm font-semibold">Perguntas para a Área Técnica:</p>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {formData.perguntas.filter(p => p.trim() !== '').map((pergunta, index) => (
                <li key={index}>{pergunta}</li>
              ))}
            </ul>
          </div>
        )}
        
        {formData.anexos && formData.anexos.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold">Anexos:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.anexos.map((anexo, index) => (
                <div key={index} className="bg-blue-50 px-2 py-1 rounded text-xs text-blue-700">
                  Arquivo {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
